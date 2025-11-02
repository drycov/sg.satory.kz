import { ROLE_PERMISSIONS, type Role } from "@/types/roles";


/**
 * Проверяет, имеет ли пользователь доступ к ресурсу
 */
export const hasAccess = (
    userRole: Role | undefined,
    requiredRole?: Role,
    requiredPermissions?: string[]
): boolean => {
    // Если роль не определена - доступ запрещен
    if (!userRole) return false;

    // Если требуется определенная роль
    if (requiredRole) {
        const roleHierarchy: Role[] = ['user', 'moderator', 'admin'];
        const userRoleIndex = roleHierarchy.indexOf(userRole);
        const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

        // Если пользователь имеет меньшую роль - доступ запрещен
        if (userRoleIndex < requiredRoleIndex) return false;
    }

    // Если требуются определенные разрешения
    if (requiredPermissions && requiredPermissions.length > 0) {
        const userPermissions = ROLE_PERMISSIONS[userRole] || [];
        const hasAllPermissions = requiredPermissions.every(permission =>
            userPermissions.includes(permission)
        );

        if (!hasAllPermissions) return false;
    }

    return true;
};

/**
 * Проверяет, имеет ли пользователь конкретное разрешение
 */
export const hasPermission = (
    userRole: Role | undefined,
    permission: string
): boolean => {
    if (!userRole) return false;

    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    return userPermissions.includes(permission);
};

/**
 * Проверяет, является ли пользователь администратором
 */
export const isAdmin = (userRole: Role | undefined): boolean => {
    return userRole === 'admin';
};