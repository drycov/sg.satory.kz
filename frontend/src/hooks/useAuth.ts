import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Реэкспорт контекста с дополнительными утилитами
export const useAuth = () => {
    const context = useAuthContext();
    
    // Дополнительные утилитные методы
    const hasPermission = (permission: string): boolean => {
        if (!context.user) return false;
        if (context.isAdmin) return true; // Админы имеют все права
        return context.user.permissions?.includes(permission) || false;
    };

    const canAccess = (requiredRole?: 'user' | 'admin', requiredPermission?: string): boolean => {
        if (!context.isAuthenticated) return false;
        
        if (requiredRole === 'admin' && !context.isAdmin) return false;
        
        if (requiredPermission && !hasPermission(requiredPermission)) return false;
        
        return true;
    };

    return {
        ...context,
        hasPermission,
        canAccess,
    };
};

// Дополнительные специализированные хуки
export const useUser = () => {
    const { user } = useAuth();
    return user;
};

export const useIsAdmin = () => {
    const { isAdmin } = useAuth();
    return isAdmin;
};

export const useAuthStatus = () => {
    const { isAuthenticated, loading } = useAuth();
    return { isAuthenticated, loading };
};