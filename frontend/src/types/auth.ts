export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    avatar?: string;
    permissions?: string[];
    
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}