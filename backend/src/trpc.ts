import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { query, healthCheck, withTransaction } from './dbConn'

// Initialize tRPC
const t = initTRPC.create()

// Export reusable router and procedure helpers
const router = t.router
const publicProcedure = t.procedure

// Define your API routes
export const appRouter = router({
    // Simple greeting query


})

// Export the type to be used on the client side
export type AppRouter = typeof appRouter
