// Token management utilities
export class TokenManager {
    private static readonly TOKEN_KEY = 'auth_token';
    private static readonly USER_KEY = 'auth_user';

    // Get token from localStorage
    static getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // Set token in localStorage
    static setToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    // Remove token from localStorage
    static removeToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    // Get user from localStorage
    static getUser(): any | null {
        if (typeof window === 'undefined') return null;
        const userJson = localStorage.getItem(this.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    // Set user in localStorage
    static setUser(user: any): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    // Check if token exists
    static hasToken(): boolean {
        return !!this.getToken();
    }

    // Check if token is expired (basic check)
    static isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        try {
            // Standard JWT format: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) return true;

            const payload = JSON.parse(atob(parts[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch (error) {
            return true;
        }
    }

    // Get token payload
    static getTokenPayload(): any | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            // Standard JWT format: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            return JSON.parse(atob(parts[1]));
        } catch (error) {
            return null;
        }
    }

    // Clear all auth data
    static clearAuth(): void {
        this.removeToken();
    }
}

// Authentication state management
export interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export class AuthManager {
    private static listeners: Array<(state: AuthState) => void> = [];
    private static state: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
    };

    // Initialize auth state from localStorage
    static init(): void {
        const token = TokenManager.getToken();
        const user = TokenManager.getUser();

        if (token && user && !TokenManager.isTokenExpired()) {
            this.state = {
                user,
                token,
                isAuthenticated: true,
                isLoading: false
            };
        }

        this.notifyListeners();
    }

    // Get current auth state
    static getState(): AuthState {
        return { ...this.state };
    }

    // Subscribe to auth state changes
    static subscribe(listener: (state: AuthState) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Login
    static login(user: any, token: string): void {
        TokenManager.setToken(token);
        TokenManager.setUser(user);

        this.state = {
            user,
            token,
            isAuthenticated: true,
            isLoading: false
        };

        this.notifyListeners();
    }

    // Logout
    static logout(): void {
        TokenManager.clearAuth();

        this.state = {
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
        };

        this.notifyListeners();
    }

    // Set loading state
    static setLoading(isLoading: boolean): void {
        this.state = {
            ...this.state,
            isLoading
        };

        this.notifyListeners();
    }

    // Update user
    static updateUser(user: any): void {
        TokenManager.setUser(user);

        this.state = {
            ...this.state,
            user
        };

        this.notifyListeners();
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        return this.state.isAuthenticated && !TokenManager.isTokenExpired();
    }

    // Notify all listeners
    private static notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.getState()));
    }
}

// HTTP utilities for authenticated requests
export class AuthHttp {
    // Get authorization header
    static getAuthHeader(): Record<string, string> {
        const token = TokenManager.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    // Create headers with auth
    static createHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
            ...additionalHeaders
        };
    }
}

// Export all utilities
export const authUtils = {
    TokenManager,
    AuthManager,
    AuthHttp
};
