import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { PackageType, PaymentStatus } from "@prisma/client";

const createPackageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  description: z.string().optional(),
  packageType: z.nativeEnum(PackageType).default(PackageType.SESSION_PACKAGE),
  price: z.number().min(0, "Price must be positive"),
  visitCount: z.number().min(1).optional(),
  validityDays: z.number().min(1).optional(),
  isRecurring: z.boolean().default(false),
  recurringPeriod: z.number().min(1).optional(),
  maxUsagePerDay: z.number().min(1).optional(),
  maxUsagePerWeek: z.number().min(1).optional(),
  transferable: z.boolean().default(false),
  serviceIds: z.array(z.string()).min(1, "At least one service must be included"),
});

const updatePackageSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  packageType: z.nativeEnum(PackageType).optional(),
  price: z.number().min(0).optional(),
  visitCount: z.number().min(1).optional(),
  validityDays: z.number().min(1).optional(),
  isRecurring: z.boolean().optional(),
  recurringPeriod: z.number().min(1).optional(),
  maxUsagePerDay: z.number().min(1).optional(),
  maxUsagePerWeek: z.number().min(1).optional(),
  transferable: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const purchasePackageSchema = z.object({
  packageId: z.string(),
  clientId: z.string(),
  purchasePrice: z.number().min(0).optional(), // Allow override pricing
});

export const fbmPackagesRouter = createTRPCRouter({
  // Get all packages
  getAll: publicProcedure
    .input(
      z.object({
        activeOnly: z.boolean().default(true),
        includeServices: z.boolean().default(true),
        packageType: z.nativeEnum(PackageType).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {};
      
      if (input?.activeOnly) {
        whereClause.isActive = true;
      }
      
      if (input?.packageType) {
        whereClause.packageType = input.packageType;
      }

      const packages = await ctx.db.fbmPackage.findMany({
        where: whereClause,
        include: {
          services: input?.includeServices ? {
            include: {
              service: true,
            },
          } : false,
          _count: {
            select: {
              purchases: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      return packages;
    }),

  // Get package by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const package = await ctx.db.fbmPackage.findUnique({
        where: { id: input.id },
        include: {
          services: {
            include: {
              service: true,
            },
          },
          purchases: {
            include: {
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
                  visit: {
                    include: {
                      service: true,
                      appointment: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              purchasedAt: "desc",
            },
          },
          _count: {
            select: {
              purchases: true,
            },
          },
        },
      });

      if (!package) {
        throw new Error("Package not found");
      }

      return package;
    }),

  // Create new package
  create: publicProcedure
    .input(createPackageSchema)
    .mutation(async ({ ctx, input }) => {
      const { serviceIds, ...packageData } = input;

      const package = await ctx.db.fbmPackage.create({
        data: packageData,
      });

      // Add services to package
      const packageServices = serviceIds.map(serviceId => ({
        packageId: package.id,
        serviceId,
      }));

      await ctx.db.fbmPackageService.createMany({
        data: packageServices,
      });

      // Return package with services
      const packageWithServices = await ctx.db.fbmPackage.findUnique({
        where: { id: package.id },
        include: {
          services: {
            include: {
              service: true,
            },
          },
        },
      });

      return packageWithServices;
    }),

  // Update package
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: updatePackageSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const package = await ctx.db.fbmPackage.update({
        where: { id: input.id },
        data: input.data,
        include: {
          services: {
            include: {
              service: true,
            },
          },
        },
      });

      return package;
    }),

  // Delete package (soft delete)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if package has active purchases
      const activePurchases = await ctx.db.fbmPackagePurchase.count({
        where: {
          packageId: input.id,
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      });

      if (activePurchases > 0) {
        throw new Error("Cannot delete package with active purchases. Deactivate instead.");
      }

      const package = await ctx.db.fbmPackage.update({
        where: { id: input.id },
        data: { isActive: false },
      });

      return package;
    }),

  // Manage package services
  updateServices: publicProcedure
    .input(
      z.object({
        packageId: z.string(),
        serviceIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Remove existing services
      await ctx.db.fbmPackageService.deleteMany({
        where: { packageId: input.packageId },
      });

      // Add new services
      if (input.serviceIds.length > 0) {
        const packageServices = input.serviceIds.map(serviceId => ({
          packageId: input.packageId,
          serviceId,
        }));

        await ctx.db.fbmPackageService.createMany({
          data: packageServices,
        });
      }

      // Return updated package
      const package = await ctx.db.fbmPackage.findUnique({
        where: { id: input.packageId },
        include: {
          services: {
            include: {
              service: true,
            },
          },
        },
      });

      return package;
    }),

  // Purchase package
  purchase: publicProcedure
    .input(purchasePackageSchema)
    .mutation(async ({ ctx, input }) => {
      const package = await ctx.db.fbmPackage.findUnique({
        where: { id: input.packageId },
        select: {
          price: true,
          visitCount: true,
          validityDays: true,
          isActive: true,
        },
      });

      if (!package) {
        throw new Error("Package not found");
      }

      if (!package.isActive) {
        throw new Error("Package is not available for purchase");
      }

      const purchasePrice = input.purchasePrice ?? package.price;
      const expiresAt = package.validityDays 
        ? new Date(Date.now() + package.validityDays * 24 * 60 * 60 * 1000)
        : null;

      const purchase = await ctx.db.fbmPackagePurchase.create({
        data: {
          packageId: input.packageId,
          clientId: input.clientId,
          purchasePrice,
          visitCount: package.visitCount,
          remainingVisits: package.visitCount,
          expiresAt,
        },
        include: {
          package: {
            include: {
              services: {
                include: {
                  service: true,
                },
              },
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

      return purchase;
    }),

  // Get client packages
  getClientPackages: publicProcedure
    .input(
      z.object({
        clientId: z.string(),
        activeOnly: z.boolean().default(true),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        clientId: input.clientId,
      };

      if (input.activeOnly) {
        whereClause.isActive = true;
        whereClause.OR = [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ];
      }

      const purchases = await ctx.db.fbmPackagePurchase.findMany({
        where: whereClause,
        include: {
          package: {
            include: {
              services: {
                include: {
                  service: true,
                },
              },
            },
          },
          visits: {
            include: {
              visit: {
                include: {
                  service: true,
                  appointment: true,
                },
              },
            },
            orderBy: {
              usedAt: "desc",
            },
          },
        },
        orderBy: {
          purchasedAt: "desc",
        },
      });

      return purchases;
    }),

  // Use package visit
  useVisit: publicProcedure
    .input(
      z.object({
        purchaseId: z.string(),
        visitId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const purchase = await ctx.db.fbmPackagePurchase.findUnique({
        where: { id: input.purchaseId },
        select: {
          remainingVisits: true,
          isActive: true,
          expiresAt: true,
        },
      });

      if (!purchase) {
        throw new Error("Package purchase not found");
      }

      if (!purchase.isActive) {
        throw new Error("Package purchase is not active");
      }

      if (purchase.expiresAt && purchase.expiresAt < new Date()) {
        throw new Error("Package has expired");
      }

      if (purchase.remainingVisits !== null && purchase.remainingVisits <= 0) {
        throw new Error("No remaining visits in package");
      }

      // Create package visit record
      const packageVisit = await ctx.db.fbmPackageVisit.create({
        data: {
          purchaseId: input.purchaseId,
          visitId: input.visitId,
        },
      });

      // Update remaining visits
      if (purchase.remainingVisits !== null) {
        await ctx.db.fbmPackagePurchase.update({
          where: { id: input.purchaseId },
          data: {
            remainingVisits: purchase.remainingVisits - 1,
          },
        });
      }

      return packageVisit;
    }),

  // Get package statistics
  getStats: publicProcedure
    .input(
      z.object({
        packageId: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {};

      if (input.packageId) {
        whereClause.packageId = input.packageId;
      }

      if (input.startDate || input.endDate) {
        whereClause.purchasedAt = {};
        if (input.startDate) whereClause.purchasedAt.gte = input.startDate;
        if (input.endDate) whereClause.purchasedAt.lte = input.endDate;
      }

      const [totalPurchases, activePurchases, totalRevenue, visitsUsed] = await Promise.all([
        ctx.db.fbmPackagePurchase.count({
          where: whereClause,
        }),
        ctx.db.fbmPackagePurchase.count({
          where: {
            ...whereClause,
            isActive: true,
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
        }),
        ctx.db.fbmPackagePurchase.aggregate({
          where: {
            ...whereClause,
            isPaid: true,
          },
          _sum: {
            purchasePrice: true,
          },
        }),
        ctx.db.fbmPackageVisit.count({
          where: {
            purchase: whereClause,
          },
        }),
      ]);

      return {
        totalPurchases,
        activePurchases,
        totalRevenue: totalRevenue._sum.purchasePrice || 0,
        visitsUsed,
      };
    }),
});