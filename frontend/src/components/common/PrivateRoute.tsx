import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingScreen from "@components/LoadingScreen";
import { useAuth } from "@hooks/useAuth";

/**
 * Пропсы для PrivateRoute
 * - children — защищённый компонент или layout
 * - roles — опционально, если в будущем будет ролевая авторизация
 * - requireAdmin — требует админских прав
 * - requiredPermissions — требует определенные разрешения
 */
export interface PrivateRouteProps {
  children?: React.ReactNode;
  roles?: string[];
  requireAdmin?: boolean;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

/**
 * PrivateRoute — защищённый маршрут, требующий авторизации
 * Проверяет аутентификацию и права доступа через useAuth
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requiredPermissions = [],
  fallback 
}) => {
  const location = useLocation();
  const { 
    isAuthenticated, 
    isAdmin, 
    hasPermission, 
    loading 
  } = useAuth();

  // Показываем загрузку при инициализации
  if (loading) {
    return <LoadingScreen />;
  }

  // ❌ Не авторизован — редиректим на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ❌ Требуется админ, но пользователь не админ
  if (requireAdmin && !isAdmin) {
    return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" replace />;
  }

  // ❌ Проверяем необходимые разрешения
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    
    if (!hasAllPermissions) {
      return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" replace />;
    }
  }

  // ✅ Все проверки пройдены — рендерим потомков или Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;