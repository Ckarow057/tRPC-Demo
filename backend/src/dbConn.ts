import dotenv from 'dotenv'
import { Pool, PoolClient, QueryResult } from 'pg'

dotenv.config()

// Database configuration interface
interface DatabaseConfig {
    host?: string
    port?: number
    database?: string
    user?: string
    password?: string
    max: number
    idleTimeoutMillis: number
    connectionTimeoutMillis: number
    maxUses: number
}

// Health check response interface
interface HealthCheckResponse {
    healthy: boolean
    timestamp: string
    error?: string
}

// Enhanced client interface
interface EnhancedClient extends PoolClient {
    lastQuery?: any[]
}

// Database configuration
const config: DatabaseConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // Fastify-optimized connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    maxUses: 7500, // Close a connection after it has been used this many times
}

// Create connection pool
const pool = new Pool(config)

// Pool event handlers for better monitoring
pool.on('connect', (client: PoolClient) => {
    console.log('New client connected to PostgreSQL')
})

pool.on('error', (err: Error, client: PoolClient) => {
    console.error('Unexpected error on idle client:', err)
})

pool.on('remove', (client: PoolClient) => {
    console.log('Client removed from pool')
})

// Helper function to execute queries with better error handling
const query = async (text: string, params: any[] = []): Promise<QueryResult> => {
    const start = Date.now()
    try {
        const res = await pool.query(text, params)
        const duration = Date.now() - start

        // Only log slow queries to reduce noise
        if (duration > 100) {
            console.log('Slow query detected', {
                text: text.slice(0, 100) + (text.length > 100 ? '...' : ''),
                duration,
                rows: res.rowCount
            })
        }

        return res
    } catch (error: any) {
        console.error('Database query error:', {
            error: error.message,
            query: text.slice(0, 100) + (text.length > 100 ? '...' : ''),
            params: params
        })
        throw error
    }
}

// Helper function to get a client for transactions
const getClient = async (): Promise<EnhancedClient> => {
    const client = await pool.connect() as EnhancedClient
    const originalQuery = client.query
    const originalRelease = client.release

    // Set a timeout of 10 seconds for transactions
    const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 10 seconds!')
        console.error(`The last executed query on this client was:`, client.lastQuery)
    }, 10000)

    // Enhanced query method with tracking
    client.query = ((...args: any[]) => {
        client.lastQuery = args
        return originalQuery.apply(client, args as any)
    }) as any

    // Enhanced release method
    client.release = (err?: Error | boolean) => {
        clearTimeout(timeout)
        client.query = originalQuery
        client.release = originalRelease
        return originalRelease.call(client, err)
    }

    return client
}

// Transaction helper function
const withTransaction = async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
    const client = await getClient()
    try {
        await client.query('BEGIN')
        const result = await callback(client)
        await client.query('COMMIT')
        return result
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

// Health check function
const healthCheck = async (): Promise<HealthCheckResponse> => {
    try {
        const result = await query('SELECT 1 as health_check')
        return { healthy: true, timestamp: new Date().toISOString() }
    } catch (error: any) {
        return { healthy: false, error: error.message, timestamp: new Date().toISOString() }
    }
}

// Graceful shutdown function
const closePool = async (): Promise<void> => {
    try {
        await pool.end()
        console.log('Database pool closed successfully')
    } catch (error) {
        console.error('Error closing database pool:', error)
        throw error
    }
}

export {
    query,
    getClient,
    withTransaction,
    healthCheck,
    closePool,
    pool
}

export type { HealthCheckResponse, EnhancedClient }
