import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const businessHoursSchema = z.record(
  z.string(),
  z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean().optional(),
  }).optional()
);

const createLocationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default("US"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  isMainLocation: z.boolean().default(false),
  timezone: z.string().default("America/New_York"),
  businessHours: businessHoursSchema.optional(),
});

const updateLocationSchema = createLocationSchema.partial();

export const fbmLocationsRouter = createTRPCRouter({
  // Get all locations
  getAll: publicProcedure
    .input(
      z.object({
        activeOnly: z.boolean().default(true),
        includeServices: z.boolean().default(false),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {};
      
      if (input?.activeOnly) {
        whereClause.isActive = true;
      }

      const locations = await ctx.db.fbmLocation.findMany({
        where: whereClause,
        include: {
          services: input?.includeServices ? {
            include: {
              service: true,
            },
          } : false,
          _count: {
            select: {
              services: true,
              appointments: true,
              visits: true,
              schedules: true,
            },
          },
        },
        orderBy: [
          { isMainLocation: "desc" },
          { name: "asc" },
        ],
      });

      return locations;
    }),

  // Get location by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const location = await ctx.db.fbmLocation.findUnique({
        where: { id: input.id },
        include: {
          services: {
            include: {
              service: true,
            },
          },
          schedules: {
            include: {
              trainer: {
                select: {
                  id: true,
                  name: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
            where: {
              isActive: true,
            },
            orderBy: [
              { dayOfWeek: "asc" },
              { startTime: "asc" },
            ],
          },
          _count: {
            select: {
              services: true,
              appointments: true,
              visits: true,
            },
          },
        },
      });

      if (!location) {
        throw new Error("Location not found");
      }

      return location;
    }),

  // Create new location
  create: publicProcedure
    .input(createLocationSchema)
    .mutation(async ({ ctx, input }) => {
      // If this is set as main location, update other locations
      if (input.isMainLocation) {
        await ctx.db.fbmLocation.updateMany({
          where: { isMainLocation: true },
          data: { isMainLocation: false },
        });
      }

      const location = await ctx.db.fbmLocation.create({
        data: {
          name: input.name,
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          country: input.country,
          phone: input.phone,
          email: input.email,
          website: input.website,
          isMainLocation: input.isMainLocation,
          timezone: input.timezone,
          businessHours: input.businessHours,
        },
        include: {
          _count: {
            select: {
              services: true,
              appointments: true,
              visits: true,
            },
          },
        },
      });

      return location;
    }),

  // Update location
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateLocationSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // If this is set as main location, update other locations
      if (input.data.isMainLocation) {
        await ctx.db.fbmLocation.updateMany({
          where: { 
            isMainLocation: true,
            id: { not: input.id },
          },
          data: { isMainLocation: false },
        });
      }

      const location = await ctx.db.fbmLocation.update({
        where: { id: input.id },
        data: input.data,
        include: {
          services: {
            include: {
              service: true,
            },
          },
          _count: {
            select: {
              services: true,
              appointments: true,
              visits: true,
            },
          },
        },
      });

      return location;
    }),

  // Delete location (soft delete)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const location = await ctx.db.fbmLocation.findUnique({
        where: { id: input.id },
        select: { isMainLocation: true },
      });

      if (location?.isMainLocation) {
        throw new Error("Cannot delete the main location. Please set another location as main first.");
      }

      const deletedLocation = await ctx.db.fbmLocation.update({
        where: { id: input.id },
        data: { isActive: false },
      });

      return deletedLocation;
    }),

  // Get location services
  getServices: publicProcedure
    .input(z.object({ 
      locationId: z.string(),
      activeOnly: z.boolean().default(true),
    }))
    .query(async ({ ctx, input }) => {
      const serviceLocations = await ctx.db.fbmServiceLocation.findMany({
        where: {
          locationId: input.locationId,
          isActive: input.activeOnly,
          service: input.activeOnly ? {
            isActive: true,
          } : undefined,
        },
        include: {
          service: {
            include: {
              _count: {
                select: {
                  appointments: {
                    where: {
                      locationId: input.locationId,
                    },
                  },
                  visits: {
                    where: {
                      locationId: input.locationId,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          service: {
            name: "asc",
          },
        },
      });

      return serviceLocations.map(sl => ({
        ...sl.service,
        customPrice: sl.customPrice,
        serviceLocationId: sl.id,
        appointmentCount: sl.service._count?.appointments || 0,
        visitCount: sl.service._count?.visits || 0,
      }));
    }),

  // Get location schedules grouped by trainer
  getSchedules: publicProcedure
    .input(z.object({ 
      locationId: z.string(),
      activeOnly: z.boolean().default(true),
    }))
    .query(async ({ ctx, input }) => {
      const schedules = await ctx.db.fbmSchedule.findMany({
        where: {
          locationId: input.locationId,
          isActive: input.activeOnly,
          effectiveUntil: input.activeOnly ? {
            gte: new Date(),
          } : undefined,
        },
        include: {
          trainer: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: [
          { trainer: { name: "asc" } },
          { dayOfWeek: "asc" },
          { startTime: "asc" },
        ],
      });

      // Group schedules by trainer
      const groupedSchedules = schedules.reduce((acc, schedule) => {
        const trainerId = schedule.trainerId;
        if (!acc[trainerId]) {
          acc[trainerId] = {
            trainer: schedule.trainer,
            schedules: [],
          };
        }
        acc[trainerId].schedules.push(schedule);
        return acc;
      }, {} as Record<string, { trainer: any; schedules: any[] }>);

      return Object.values(groupedSchedules);
    }),

  // Get location statistics
  getStats: publicProcedure
    .input(
      z.object({
        locationId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        locationId: input.locationId,
      };

      if (input.startDate || input.endDate) {
        whereClause.createdAt = {};
        if (input.startDate) whereClause.createdAt.gte = input.startDate;
        if (input.endDate) whereClause.createdAt.lte = input.endDate;
      }

      const [totalAppointments, completedVisits, totalRevenue, activeServices] = await Promise.all([
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
        ctx.db.fbmServiceLocation.count({
          where: {
            locationId: input.locationId,
            isActive: true,
            service: {
              isActive: true,
            },
          },
        }),
      ]);

      return {
        totalAppointments,
        completedVisits,
        totalRevenue: totalRevenue._sum.price || 0,
        activeServices,
        utilizationRate: totalAppointments > 0 ? (completedVisits / totalAppointments) * 100 : 0,
      };
    }),

  // Get main location
  getMain: publicProcedure
    .query(async ({ ctx }) => {
      const mainLocation = await ctx.db.fbmLocation.findFirst({
        where: {
          isMainLocation: true,
          isActive: true,
        },
        include: {
          _count: {
            select: {
              services: true,
              appointments: true,
              visits: true,
            },
          },
        },
      });

      return mainLocation;
    }),
});