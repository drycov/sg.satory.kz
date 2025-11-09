import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * PrivateRoute — защищает маршруты VPN User Manager
 * — использует централизованный useAuth()
 * — автоматически редиректит на /login при отсутствии токена
 */
export default function PrivateRoute() {
  const { isAuthenticated, checkAuth } = useAuth();

  // Проверяем авторизацию (на случай обновления страницы)
  const isAuth = isAuthenticated || checkAuth();

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
