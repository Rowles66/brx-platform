import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ServiceCategory } from "@prisma/client";

const createFbmServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  category: z.nativeEnum(ServiceCategory).default(ServiceCategory.PERSONAL_TRAINING),
  price: z.number().min(0).optional(),
  duration: z.number().min(1).optional(),
  maxCapacity: z.number().min(1).default(1),
  requireTrainer: z.boolean().default(true),
  maxAdvanceBooking: z.number().min(1).optional(),
  minAdvanceBooking: z.number().min(1).optional(),
  cancellationPolicy: z.string().optional(),
  availableDays: z.array(z.string()).default([]),
  availableTimeSlots: z.any().optional(), // JSON field
});

const updateFbmServiceSchema = createFbmServiceSchema.partial();

export const fbmServicesRouter = createTRPCRouter({
  // Get all FBM services
  getAll: publicProcedure
    .input(
      z.object({
        locationId: z.string().optional(),
        category: z.nativeEnum(ServiceCategory).optional(),
        activeOnly: z.boolean().default(true),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {};
      
      if (input?.activeOnly) {
        whereClause.isActive = true;
      }
      
      if (input?.category) {
        whereClause.category = input.category;
      }

      let services = await ctx.db.fbmService.findMany({
        where: whereClause,
        include: {
          locations: {
            include: {
              location: true,
            },
            where: input?.locationId ? {
              locationId: input.locationId,
            } : undefined,
          },
          _count: {
            select: {
              appointments: true,
              visits: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      // Filter by location if specified
      if (input?.locationId) {
        services = services.filter(service => service.locations.length > 0);
      }

      return services;
    }),

  // Get single FBM service by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = await ctx.db.fbmService.findUnique({
        where: { id: input.id },
        include: {
          locations: {
            include: {
              location: true,
            },
          },
          packages: {
            include: {
              package: true,
            },
          },
          _count: {
            select: {
              appointments: true,
              visits: true,
            },
          },
        },
      });

      if (!service) {
        throw new Error("Service not found");
      }

      return service;
    }),

  // Create new FBM service
  create: publicProcedure
    .input(createFbmServiceSchema)
    .mutation(async ({ ctx, input }) => {
      const service = await ctx.db.fbmService.create({
        data: {
          name: input.name,
          description: input.description,
          category: input.category,
          price: input.price,
          duration: input.duration,
          maxCapacity: input.maxCapacity,
          requireTrainer: input.requireTrainer,
          maxAdvanceBooking: input.maxAdvanceBooking,
          minAdvanceBooking: input.minAdvanceBooking,
          cancellationPolicy: input.cancellationPolicy,
          availableDays: input.availableDays,
          availableTimeSlots: input.availableTimeSlots,
        },
        include: {
          locations: {
            include: {
              location: true,
            },
          },
        },
      });

      return service;
    }),

  // Update FBM service
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateFbmServiceSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const service = await ctx.db.fbmService.update({
        where: { id: input.id },
        data: input.data,
        include: {
          locations: {
            include: {
              location: true,
            },
          },
        },
      });

      return service;
    }),

  // Delete FBM service (soft delete by setting isActive to false)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = await ctx.db.fbmService.update({
        where: { id: input.id },
        data: { isActive: false },
      });

      return service;
    }),

  // Assign service to location
  assignToLocation: publicProcedure
    .input(
      z.object({
        serviceId: z.string(),
        locationId: z.string(),
        customPrice: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const serviceLocation = await ctx.db.fbmServiceLocation.create({
        data: {
          serviceId: input.serviceId,
          locationId: input.locationId,
          customPrice: input.customPrice,
        },
        include: {
          service: true,
          location: true,
        },
      });

      return serviceLocation;
    }),

  // Remove service from location
  removeFromLocation: publicProcedure
    .input(
      z.object({
        serviceId: z.string(),
        locationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.db.fbmServiceLocation.delete({
        where: {
          serviceId_locationId: {
            serviceId: input.serviceId,
            locationId: input.locationId,
          },
        },
      });

      return deleted;
    }),

  // Get service statistics
  getStats: publicProcedure
    .input(
      z.object({
        serviceId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        serviceId: input.serviceId,
      };

      if (input.startDate || input.endDate) {
        whereClause.createdAt = {};
        if (input.startDate) whereClause.createdAt.gte = input.startDate;
        if (input.endDate) whereClause.createdAt.lte = input.endDate;
      }

      const [totalAppointments, completedVisits, totalRevenue] = await Promise.all([
        ctx.db.fbmAppointment.count({
          where: whereClause,
        }),
        ctx.db.fbmVisit.count({
          where: {
            ...whereClause,
            status: "COMPLETED",
          },
        }),
        ctx.db.fbmVisit.aggregate({
          where: {
            ...whereClause,
            status: "COMPLETED",
            isPaid: true,
          },
          _sum: {
            price: true,
          },
        }),
      ]);

      return {
        totalAppointments,
        completedVisits,
        totalRevenue: totalRevenue._sum.price || 0,
        completionRate: totalAppointments > 0 ? (completedVisits / totalAppointments) * 100 : 0,
      };
    }),
});