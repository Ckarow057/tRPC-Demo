import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();

// Create connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Create Drizzle database instance
export const db = drizzle(pool, { schema });

export const healthCheck = async (): Promise<{ healthy: boolean; timestamp: string; error?: string }> => {
    try {
        await pool.query('SELECT 1 as health_check');
        return { healthy: true, timestamp: new Date().toISOString() };
    } catch (error: any) {
        return { healthy: false, error: error.message, timestamp: new Date().toISOString() };
    }
};

export const closePool = async (): Promise<void> => {
    await pool.end();
};

export { pool };
