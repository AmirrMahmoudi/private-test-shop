'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const TOKEN_KEY = 'admin_token';

// Helper to decode JWT and check expiration
function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expiry;
    } catch {
        return true; // If we can't decode, consider it expired
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Verify token with server
    const verifyToken = useCallback(async (tokenToVerify: string): Promise<boolean> => {
        try {
            // First check if token is expired locally
            if (isTokenExpired(tokenToVerify)) {
                console.log('Token expired locally');
                return false;
            }

            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${tokenToVerify}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setToken(tokenToVerify);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    }, []);

    // Clear auth state
    const clearAuth = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        if (pathname !== '/login') {
            router.push('/login');
        }
    }, [pathname, router]);

    // Check token on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem(TOKEN_KEY);

            if (storedToken) {
                const isValid = await verifyToken(storedToken);
                if (!isValid) {
                    clearAuth();
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, [verifyToken, clearAuth]);

    // Check token on route change
    useEffect(() => {
        if (pathname === '/login') return;

        const storedToken = localStorage.getItem(TOKEN_KEY);

        // If no token in localStorage but we have one in state, clear state
        if (!storedToken && token) {
            clearAuth();
            return;
        }

        // If token expired, clear auth
        if (storedToken && isTokenExpired(storedToken)) {
            console.log('Token expired on navigation');
            clearAuth();
        }
    }, [pathname, token, clearAuth]);

    // Listen for storage changes (cross-tab logout)
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === TOKEN_KEY) {
                if (!event.newValue) {
                    // Token was removed (logged out in another tab)
                    setToken(null);
                    setUser(null);
                    if (pathname !== '/login') {
                        router.push('/login');
                    }
                } else if (event.newValue !== token) {
                    // Token was changed (logged in in another tab)
                    verifyToken(event.newValue);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [token, pathname, router, verifyToken]);

    // Periodic token validation (every 5 minutes)
    useEffect(() => {
        if (!token) return;

        const interval = setInterval(async () => {
            const storedToken = localStorage.getItem(TOKEN_KEY);

            if (!storedToken) {
                clearAuth();
                return;
            }

            if (isTokenExpired(storedToken)) {
                console.log('Token expired during session');
                clearAuth();
                return;
            }

            // Optionally verify with server periodically
            const isValid = await verifyToken(storedToken);
            if (!isValid) {
                clearAuth();
            }
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [token, verifyToken, clearAuth]);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem(TOKEN_KEY, data.token);
                setToken(data.token);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || 'ورود ناموفق بود' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'خطا در اتصال به سرور' };
        }
    };

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        // Call logout endpoint (fire and forget)
        fetch(`${API_URL}/auth/logout`, { method: 'POST' }).catch(() => { });
        router.push('/login');
    }, [router]);

    const checkAuth = async (): Promise<boolean> => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (!storedToken) return false;

        if (isTokenExpired(storedToken)) return false;

        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });
            return response.ok;
        } catch {
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user && !!token,
                login,
                logout,
                checkAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Helper to get token for API calls
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && isTokenExpired(token)) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
    }
    return token;
}
