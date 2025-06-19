import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { AppointmentStatus, PaymentStatus } from "@prisma/client";

const createAppointmentSchema = z.object({
  serviceId: z.string(),
  locationId: z.string(),
  trainerId: z.string(),
  clientId: z.string().optional(),
  scheduledAt: z.date(),
  duration: z.number().min(1),
  price: z.number().min(0).optional(),
  notes: z.string().optional(),
  maxCapacity: z.number().min(1).default(1),
});

const updateAppointmentSchema = z.object({
  serviceId: z.string().optional(),
  locationId: z.string().optional(),
  trainerId: z.string().optional(),
  clientId: z.string().optional(),
  scheduledAt: z.date().optional(),
  endTime: z.date().optional(),
  duration: z.number().min(1).optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  price: z.number().min(0).optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  maxCapacity: z.number().min(1).optional(),
  cancellationReason: z.string().optional(),
});

export const fbmAppointmentsRouter = createTRPCRouter({
  // Get all appointments with filtering
  getAll: publicProcedure
    .input(
      z.object({
        trainerId: z.string().optional(),
        clientId: z.string().optional(),
        locationId: z.string().optional(),
        serviceId: z.string().optional(),
        status: z.nativeEnum(AppointmentStatus).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {};

      if (input?.trainerId) whereClause.trainerId = input.trainerId;
      if (input?.clientId) whereClause.clientId = input.clientId;
      if (input?.locationId) whereClause.locationId = input.locationId;
      if (input?.serviceId) whereClause.serviceId = input.serviceId;
      if (input?.status) whereClause.status = input.status;

      if (input?.startDate || input?.endDate) {
        whereClause.scheduledAt = {};
        if (input.startDate) whereClause.scheduledAt.gte = input.startDate;
        if (input.endDate) whereClause.scheduledAt.lte = input.endDate;
      }

      const appointments = await ctx.db.fbmAppointment.findMany({
        where: whereClause,
        include: {
          service: true,
          location: true,
          trainer: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          visits: {
            include: {
              packageVisit: {
                include: {
                  purchase: {
                    include: {
                      package: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          scheduledAt: "asc",
        },
        take: input?.limit || 50,
        skip: input?.offset || 0,
      });

      return appointments;
    }),

  // Get appointment by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const appointment = await ctx.db.fbmAppointment.findUnique({
        where: { id: input.id },
        include: {
          service: true,
          location: true,
          trainer: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          visits: {
            include: {
              packageVisit: {
                include: {
                  purchase: {
                    include: {
                      package: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!appointment) {
        throw new Error("Appointment not found");
      }

      return appointment;
    }),

  // Create new appointment
  create: publicProcedure
    .input(createAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      const endTime = new Date(input.scheduledAt);
      endTime.setMinutes(endTime.getMinutes() + input.duration);

      const appointment = await ctx.db.fbmAppointment.create({
        data: {
          serviceId: input.serviceId,
          locationId: input.locationId,
          trainerId: input.trainerId,
          clientId: input.clientId,
          scheduledAt: input.scheduledAt,
          endTime: endTime,
          duration: input.duration,
          price: input.price,
          notes: input.notes,
          maxCapacity: input.maxCapacity,
          currentBookings: input.clientId ? 1 : 0,
        },
        include: {
          service: true,
          location: true,
          trainer: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return appointment;
    }),

  // Update appointment
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateAppointmentSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = { ...input.data };

      // Update endTime if scheduledAt or duration changes
      if (input.data.scheduledAt || input.data.duration) {
        const appointment = await ctx.db.fbmAppointment.findUnique({
          where: { id: input.id },
          select: { scheduledAt: true, duration: true },
        });

        if (appointment) {
          const scheduledAt = input.data.scheduledAt || appointment.scheduledAt;
          const duration = input.data.duration || appointment.duration;
          
          const endTime = new Date(scheduledAt);
          endTime.setMinutes(endTime.getMinutes() + duration);
          updateData.endTime = endTime;
        }
      }

      const appointment = await ctx.db.fbmAppointment.update({
        where: { id: input.id },
        data: updateData,
        include: {
          service: true,
          location: true,
          trainer: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return appointment;
    }),

  // Cancel appointment
  cancel: publicProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.db.fbmAppointment.update({
        where: { id: input.id },
        data: {
          status: AppointmentStatus.CANCELLED,
          cancellationReason: input.reason,
          cancelledAt: new Date(),
        },
        include: {
          service: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return appointment;
    }),

  // Book client into appointment
  bookClient: publicProcedure
    .input(
      z.object({
        appointmentId: z.string(),
        clientId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.db.fbmAppointment.findUnique({
        where: { id: input.appointmentId },
        select: { maxCapacity: true, currentBookings: true },
      });

      if (!appointment) {
        throw new Error("Appointment not found");
      }

      if (appointment.currentBookings >= appointment.maxCapacity) {
        throw new Error("Appointment is already at full capacity");
      }

      const updatedAppointment = await ctx.db.fbmAppointment.update({
        where: { id: input.appointmentId },
        data: {
          clientId: input.clientId,
          currentBookings: appointment.currentBookings + 1,
          status: AppointmentStatus.CONFIRMED,
        },
        include: {
          service: true,
          location: true,
          client: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return updatedAppointment;
    }),

  // Get available time slots for booking
  getAvailableSlots: publicProcedure
    .input(
      z.object({
        serviceId: z.string(),
        locationId: z.string(),
        trainerId: z.string(),
        date: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get existing appointments for this trainer on this date
      const existingAppointments = await ctx.db.fbmAppointment.findMany({
        where: {
          trainerId: input.trainerId,
          locationId: input.locationId,
          scheduledAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS],
          },
        },
        select: {
          scheduledAt: true,
          endTime: true,
        },
        orderBy: {
          scheduledAt: "asc",
        },
      });

      // Get trainer schedule for this day
      const dayOfWeek = input.date.getDay();
      const trainerSchedule = await ctx.db.fbmSchedule.findFirst({
        where: {
          trainerId: input.trainerId,
          locationId: input.locationId,
          dayOfWeek: dayOfWeek,
          isActive: true,
          effectiveFrom: {
            lte: input.date,
          },
          OR: [
            { effectiveUntil: null },
            { effectiveUntil: { gte: input.date } },
          ],
        },
      });

      if (!trainerSchedule) {
        return []; // No schedule found for this day
      }

      // Get service details for duration
      const service = await ctx.db.fbmService.findUnique({
        where: { id: input.serviceId },
        select: { duration: true },
      });

      const serviceDuration = service?.duration || 60; // Default 60 minutes

      // Generate available slots (this is a simplified version)
      // In a real implementation, you'd want more sophisticated slot generation
      const availableSlots: Array<{ startTime: Date; endTime: Date; available: boolean }> = [];
      
      return {
        availableSlots,
        trainerSchedule,
        existingAppointments,
        serviceDuration,
      };
    }),

  // Get appointment statistics
  getStats: publicProcedure
    .input(
      z.object({
        trainerId: z.string().optional(),
        locationId: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {};

      if (input.trainerId) whereClause.trainerId = input.trainerId;
      if (input.locationId) whereClause.locationId = input.locationId;

      if (input.startDate || input.endDate) {
        whereClause.scheduledAt = {};
        if (input.startDate) whereClause.scheduledAt.gte = input.startDate;
        if (input.endDate) whereClause.scheduledAt.lte = input.endDate;
      }

      const [totalAppointments, completedAppointments, cancelledAppointments, noShowAppointments] = await Promise.all([
        ctx.db.fbmAppointment.count({
          where: whereClause,
        }),
        ctx.db.fbmAppointment.count({
          where: {
            ...whereClause,
            status: AppointmentStatus.COMPLETED,
          },
        }),
        ctx.db.fbmAppointment.count({
          where: {
            ...whereClause,
            status: AppointmentStatus.CANCELLED,
          },
        }),
        ctx.db.fbmAppointment.count({
          where: {
            ...whereClause,
            status: AppointmentStatus.NO_SHOW,
          },
        }),
      ]);

      return {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        noShowAppointments,
        completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
        cancellationRate: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
        noShowRate: totalAppointments > 0 ? (noShowAppointments / totalAppointments) * 100 : 0,
      };
    }),
});