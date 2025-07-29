import { initTRPC, TRPCError } from '@trpc/server'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { db } from './db'
import { users, merch, coffee } from './db/schema'
import { healthCheck } from './db'
import { authenticate, generateToken, TokenPayload } from './middleware/auth'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Define context type
export interface Context {
    req: CreateFastifyContextOptions['req']
    res: CreateFastifyContextOptions['res']
    user?: any
    token?: TokenPayload
}

// Create context function
export function createContext({ req, res }: CreateFastifyContextOptions): Context {
    return { req, res }
}

// Initialize tRPC with context
const t = initTRPC.context<Context>().create()

// Export reusable router and procedure helpers
const router = t.router
const publicProcedure = t.procedure

// Protected procedure with authentication
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    const authHeader = ctx.req.headers.authorization

    try {
        const { user, token } = await authenticate(authHeader)
        return next({
            ctx: {
                ...ctx,
                user,
                token,
            }
        })
    } catch (error) {
        throw error // TRPCError is already thrown from authenticate
    }
})

// Define your API routes
export const appRouter = router({

    // Authentication routes (nested for organized access)
    auth: router({
        // Login endpoint - public
        login: publicProcedure
            .input(z.object({
                email: z.string().email(),
                // In a real app, you'd verify password here
                password: z.string().min(1)
            }))
            .mutation(async ({ input }) => {
                try {
                    // Find user by email
                    const userResult = await db.select().from(users).where(eq(users.email, input.email)).limit(1)

                    if (userResult.length === 0) {
                        throw new TRPCError({
                            code: 'UNAUTHORIZED',
                            message: 'Invalid credentials',
                        })
                    }

                    const user = userResult[0]

                    // In a real app, verify password hash here
                    // For demo purposes, we'll accept any password

                    // Generate token
                    const token = generateToken({
                        userId: user.id,
                        email: user.email
                    })

                    return {
                        user: {
                            id: user.id,
                            name: `${user.first_name} ${user.last_name}`,
                            email: user.email
                        },
                        token
                    }
                } catch (error) {
                    if (error instanceof TRPCError) {
                        throw error
                    }
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Login failed',
                    })
                }
            }),

        // Get current user - protected
        me: protectedProcedure.query(async ({ ctx }) => {
            return {
                user: ctx.user,
                tokenInfo: {
                    userId: ctx.token?.userId,
                    email: ctx.token?.email,
                    iat: ctx.token?.iat,
                    exp: ctx.token?.exp
                }
            }
        }),

        // Refresh token - protected
        refresh: protectedProcedure.mutation(async ({ ctx }) => {
            const token = generateToken({
                userId: ctx.user.id,
                email: ctx.user.email
            })

            return { token }
        })
    }),

    // Health check endpoint - public
    healthCheck: publicProcedure.query(async () => {
        try {
            const health = await healthCheck();
            return health;
        } catch (error) {
            throw error;
        }
    }),

    // Public endpoints (no auth required)
    public: router({
        getAllUsers: publicProcedure.query(async () => {
            try {
                const result = await db.select().from(users);
                return result;
            } catch (error) {
                throw error;
            }
        }),

        getAllMerch: publicProcedure.query(async () => {
            try {
                const result = await db.select().from(merch);
                return result;
            } catch (error) {
                throw error;
            }
        }),

        getAllCoffee: publicProcedure.query(async () => {
            try {
                const result = await db.select().from(coffee);
                return result;
            } catch (error) {
                throw error;
            }
        }),
    }),

    // Protected endpoints (require authentication)
    protected: router({
        // User management
        users: router({
            getProfile: protectedProcedure.query(async ({ ctx }) => {
                return ctx.user
            }),

            updateProfile: protectedProcedure
                .input(z.object({
                    first_name: z.string().optional(),
                    last_name: z.string().optional(),
                    email: z.string().email().optional(),
                    birthdate: z.string().optional() // Change to string to match DATE column
                }))
                .mutation(async ({ ctx, input }) => {
                    try {
                        const updatedUser = await db
                            .update(users)
                            .set(input)
                            .where(eq(users.id, ctx.user.id))
                            .returning()

                        return updatedUser[0]
                    } catch (error) {
                        throw new TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'Failed to update profile',
                        })
                    }
                }),

            deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
                try {
                    await db.delete(users).where(eq(users.id, ctx.user.id))
                    return { success: true, message: 'Account deleted successfully' }
                } catch (error) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Failed to delete account',
                    })
                }
            })
        }),

        // Admin operations (in a real app, you'd check for admin role)
        admin: router({
            getAllUsersSecure: protectedProcedure.query(async () => {
                try {
                    const result = await db.select().from(users);
                    return result;
                } catch (error) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Failed to fetch users',
                    })
                }
            }),

            createUser: protectedProcedure
                .input(z.object({
                    first_name: z.string().min(1),
                    last_name: z.string().min(1),
                    email: z.string().email(),
                    birthdate: z.string().optional() // Change to string to match DATE column
                }))
                .mutation(async ({ input }) => {
                    try {
                        const newUser = await db.insert(users).values(input).returning()

                        return newUser[0]
                    } catch (error) {
                        throw new TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'Failed to create user',
                        })
                    }
                })
        })
    })
})

// Export the type to be used on the client side
export type AppRouter = typeof appRouter
