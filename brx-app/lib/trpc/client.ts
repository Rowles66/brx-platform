import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@/server/routers" // Adjusted path

export const trpc = createTRPCReact<AppRouter>()
