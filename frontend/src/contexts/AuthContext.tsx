import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthContextType, LoginCredentials } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Проверяем наличие токена при загрузке приложения
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                setLoading(false);
                return;
            }

            // Здесь должен быть запрос к API для проверки токена
            // Для демонстрации используем моковые данные
            const userData = await mockVerifyToken(token);
            setUser(userData);
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('authToken');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            // Здесь должен быть реальный API call
            const result = await mockLogin({ email, password });
            
            if (result.success && result.user && result.token) {
                setUser(result.user);
                localStorage.setItem('authToken', result.token);
                return true;
            } else {
                setError(result.message || 'Login failed');
                return false;
            }
        } catch (err) {
            setError('An error occurred during login');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        setError(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        loading,
        error,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для использования контекста
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Моковые функции для демонстрации
const mockLogin = async (credentials: LoginCredentials): Promise<{
    success: boolean;
    user?: User;
    token?: string;
    message?: string;
}> => {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Моковые пользователи
    const mockUsers = [
        {
            id: '1',
            email: 'admin@example.com',
            password: 'admin123',
            user: {
                id: '1',
                email: 'admin@example.com',
                name: 'Admin User',
                role: 'admin' as const,
                permissions: ['read', 'write', 'delete', 'admin'],
            }
        },
        {
            id: '2',
            email: 'user@example.com',
            password: 'user123',
            user: {
                id: '2',
                email: 'user@example.com',
                name: 'Regular User',
                role: 'user' as const,
                permissions: ['read'],
            }
        }
    ];

    const user = mockUsers.find(u => 
        u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
        return {
            success: true,
            user: user.user,
            token: `mock-jwt-token-${user.id}`,
        };
    }

    return {
        success: false,
        message: 'Invalid email or password',
    };
};

const mockVerifyToken = async (token: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Извлекаем ID пользователя из токена
    const userId = token.replace('mock-jwt-token-', '');
    
    const mockUsers: Record<string, User> = {
        '1': {
            id: '1',
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'admin',
            permissions: ['read', 'write', 'delete', 'admin'],
        },
        '2': {
            id: '2',
            email: 'user@example.com',
            name: 'Regular User',
            role: 'user',
            permissions: ['read'],
        }
    };

    return mockUsers[userId] || mockUsers['2']; // По умолчанию обычный пользователь
};