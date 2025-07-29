import { TRPCError } from '@trpc/server';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

// Type for the decoded token payload
export interface TokenPayload {
    userId: number;
    email: string;
    iat?: number;
    exp?: number;
}

// Mock JWT secret - in production, use proper environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Simple JWT encode/decode functions using Node.js built-in crypto
// In production, consider using a proper JWT library like 'jsonwebtoken'
function base64UrlEncode(str: string): string {
    return Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function base64UrlDecode(str: string): string {
    // Add padding if necessary
    str += '==='.slice(0, (4 - str.length % 4) % 4);
    // Replace URL-safe characters
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(str, 'base64').toString();
}

// Simple HMAC-SHA256 signature
function sign(data: string, secret: string): string {
    const crypto = require('crypto');
    return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

// Generate JWT token
export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const tokenPayload: TokenPayload = {
        ...payload,
        iat: now,
        exp: now + (24 * 60 * 60) // 24 hours
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
    const signature = sign(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }

        const [encodedHeader, encodedPayload, signature] = parts;

        // Verify signature
        const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
        if (signature !== expectedSignature) {
            throw new Error('Invalid token signature');
        }

        // Decode payload
        const payload: TokenPayload = JSON.parse(base64UrlDecode(encodedPayload));

        // Check expiration
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            throw new Error('Token expired');
        }

        return payload;
    } catch (error) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: error instanceof Error ? error.message : 'Invalid token',
        });
    }
}

// Extract token from authorization header
export function extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Missing authorization header',
        });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid authorization header format. Expected: Bearer <token>',
        });
    }

    return parts[1];
}

// Validate user exists in database
export async function validateUser(userId: number): Promise<any> {
    try {
        const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

        if (user.length === 0) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User not found',
            });
        }

        return user[0];
    } catch (error) {
        if (error instanceof TRPCError) {
            throw error;
        }
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error validating user',
        });
    }
}

// Complete authentication middleware
export async function authenticate(authHeader?: string): Promise<{ user: any; token: TokenPayload }> {
    const token = extractTokenFromHeader(authHeader);
    const payload = verifyToken(token);
    const user = await validateUser(payload.userId);

    return { user, token: payload };
}

// Authentication utilities
export const authUtils = {
    generateToken,
    verifyToken,
    extractTokenFromHeader,
    validateUser,
    authenticate,
};
