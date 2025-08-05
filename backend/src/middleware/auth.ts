import { TRPCError } from '@trpc/server';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

// Type for the decoded token payload
export interface TokenPayload {
    userId: number;
    email: string;
    iat?: number;
    exp?: number;
}

// JWT secret - in production, use proper environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6';

// Generate JWT token using jsonwebtoken library
export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    try {
        return jwt.sign(
            payload,
            JWT_SECRET,
            {
                expiresIn: '24h', // 24 hours
                algorithm: 'HS256'
            }
        );
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to generate token',
        });
    }
}

// Verify JWT token using jsonwebtoken library
export function verifyToken(token: string): TokenPayload {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256']
        }) as TokenPayload;

        return decoded;
    } catch (error) {
        let message = 'Invalid token';

        if (error instanceof jwt.TokenExpiredError) {
            message = 'Token expired';
        } else if (error instanceof jwt.JsonWebTokenError) {
            message = 'Invalid token signature';
        } else if (error instanceof jwt.NotBeforeError) {
            message = 'Token not active yet';
        }

        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message,
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
