import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthManager, TokenManager } from '../lib/auth';
import type { AuthState } from '../lib/auth';
import { trpc } from '../lib/trpc';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refresh: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [authState, setAuthState] = useState<AuthState>(AuthManager.getState());

    useEffect(() => {
        // Initialize auth manager
        AuthManager.init();

        // Subscribe to auth state changes
        const unsubscribe = AuthManager.subscribe((state) => {
            setAuthState(state);
        });

        // Check auth on mount
        checkAuth();

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            AuthManager.setLoading(true);

            const response = await trpc.auth.login.mutate({ email, password });

            AuthManager.login(response.user, response.token);
        } catch (error) {
            AuthManager.setLoading(false);
            throw error;
        }
    };

    const logout = (): void => {
        AuthManager.logout();
    };

    const refresh = async (): Promise<void> => {
        try {
            if (!AuthManager.isAuthenticated()) {
                throw new Error('Not authenticated');
            }

            const response = await trpc.auth.refresh.mutate();
            const user = AuthManager.getState().user;

            if (user) {
                AuthManager.login(user, response.token);
            }
        } catch (error) {
            // If refresh fails, logout
            AuthManager.logout();
            throw error;
        }
    };

    const checkAuth = async (): Promise<void> => {
        try {
            if (!TokenManager.hasToken() || TokenManager.isTokenExpired()) {
                AuthManager.logout();
                return;
            }

            // Verify token with server
            const response = await trpc.auth.me.query();
            AuthManager.updateUser(response.user);
        } catch (error) {
            // If check fails, logout
            AuthManager.logout();
        }
    };

    const contextValue: AuthContextType = {
        ...authState,
        login,
        logout,
        refresh,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
