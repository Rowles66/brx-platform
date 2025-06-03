import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc'

export const userRouter = createTRPCRouter({
  me: protectedProcedure
    .query(async ({ ctx }) => {
      // In a real app, fetch user from database using ctx.session.userId
      return {
        id: ctx.session.userId,
        email: 'test@example.com',
        name: 'Test User',
        role: 'athlete',
        profile: {
          avatar: null,
          bio: null,
          goals: [],
        },
      }
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        bio: z.string().max(500).optional(),
        avatar: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // In a real app, update user in database
      return {
        success: true,
        user: {
          id: ctx.session.userId,
          email: 'test@example.com',
          name: input.name || 'Test User',
          role: 'athlete',
          profile: {
            avatar: input.avatar || null,
            bio: input.bio || null,
            goals: [],
          },
        },
      }
    }),

  getRequiredItems: protectedProcedure
    .query(async ({ ctx }) => {
      // Mock required items - based on the scraped API response
      return {
        items: [
          {
            id: '1',
            type: 'profile_complete',
            completed: false,
            required: true,
          },
          {
            id: '2',
            type: 'emergency_contact',
            completed: false,
            required: true,
          },
        ],
      }
    }),
}) 