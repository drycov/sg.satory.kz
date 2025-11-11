import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "@routes/PrivateRoute";
import DashboardLayout from "@layouts/DashboardLayout";
import LoadingScreen from "@components/LoadingScreen";

// Ленивые страницы
const HomePage = lazy(() => import("@pages/HomePage"));
const UsersPage = lazy(() => import("@pages/UsersPage"));
const SettingsPage = lazy(() => import("@pages/SettingsPage"));
const LoginPage = lazy(() => import("@pages/LoginPage"));
const NotFoundPage = lazy(() => import("@components/NotFoundPage"));
const MergedUsersPage = lazy(() => import("@/pages/MergedUsersPage"));
/**
 * Централизованный контроллер маршрутов
 * — отвечает за всю маршрутизацию внутри приложения
 * — подключает layout и guard’ы
 */
export default function RouteController() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Публичная зона */}
        <Route path="/login" element={<LoginPage />} />

        {/* Приватная зона под DashboardLayout */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/vpn-users" element={<MergedUsersPage/>} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Служебные маршруты */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
