import dotenv from 'dotenv'
import fastify, { FastifyInstance } from 'fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { pool, closePool } from './db'
import { appRouter, createContext } from './trpc'

dotenv.config()

const server: FastifyInstance = fastify({
    logger: {
        level: 'info',
        transport: process.env.NODE_ENV !== 'production' ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
            }
        } : undefined
    }
})

const port = parseInt(process.env.PORT || '3000')
const host = process.env.HOST || '0.0.0.0'

// Test database connection on startup
const testConnection = async (): Promise<void> => {
    try {
        const client = await pool.connect()
        server.log.info('Connected to PostgreSQL database successfully!')
        client.release()
    } catch (err: any) {
        server.log.error('Error connecting to PostgreSQL database:', err.stack)
        process.exit(1)
    }
}

// Register routes
const registerRoutes = async (): Promise<void> => {
    // Register CORS
    await server.register(import('@fastify/cors'), {
        origin: true, // Allow all origins in development
        credentials: true
    })

    // Register tRPC
    await server.register(fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: {
            router: appRouter,
            createContext
        }
    })

    // Root route
    server.get('/', async (request, reply) => {
        return {
            message: 'Fastify + PostgreSQL + tRPC ready.',
            tRPC: 'Available at /trpc'
        }
    })


}

// Shutdown function
const shutdown = async (signal: string): Promise<void> => {
    server.log.info(`Received ${signal}, shutting down...`)
    try {
        await server.close()
        await closePool()
        server.log.info('Server and database connections closed successfully')
        process.exit(0)
    } catch (err) {
        server.log.error('Error during shutdown:', err)
        process.exit(1)
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    server.log.error('Uncaught Exception:', err)
    shutdown('uncaughtException')
})

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    server.log.error('Unhandled Rejection at:', promise, 'reason:', reason)
    shutdown('unhandledRejection')
})

// Handle termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// Start server
const start = async (): Promise<void> => {
    try {
        await testConnection()
        await registerRoutes()

        await server.listen({ port, host })
        server.log.info(`Fastify server listening on http://${host}:${port}`)
    } catch (err: any) {
        server.log.error('Error starting server:', err)
        process.exit(1)
    }
}

// Start the server
start()
