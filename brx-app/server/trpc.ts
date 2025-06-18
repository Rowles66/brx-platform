import { initTRPC } from "@trpc/server"
import superjson from "superjson"

const t = initTRPC.create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

export const createCallerFactory = t.createCallerFactory
export const router = t.router
export const publicProcedure = t.procedure
