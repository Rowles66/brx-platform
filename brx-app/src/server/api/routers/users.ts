import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
// import { prisma } from '@/lib/prisma'; // TODO: Use when real DB is connected

export const usersRouter = createTRPCRouter({
  // Get all users
  getAll: publicProcedure.query(async () => {
    // For now, return static data since we don't have a real DB connection
    return [
      {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        email: 'john@brxperformance.com',
        name: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }),

  // Get user by email
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      // Static data for demo
      const users = [
        {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      return users.find(user => user.email === input.email) || null;
    }),

  // Create user
  create: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Static response for demo
      return {
        id: Math.random().toString(),
        email: input.email,
        name: input.name || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
});

