import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import LoadingScreen from "@components/LoadingScreen";

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean; // Если true, то авторизованные пользователи не могут получить доступ
}

/**
 * PublicRoute - маршрут для публичных страниц
 * - Если пользователь авторизован и restricted=true - редирект на главную
 * - Иначе показывает дочерний компонент
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  restricted = false 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  // Если маршрут ограничен (например, /login) и пользователь авторизован
  if (restricted && isAuthenticated) {
    // Редиректим на страницу, откуда пришли, или на главную
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;