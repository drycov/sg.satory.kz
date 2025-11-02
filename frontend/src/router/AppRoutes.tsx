import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingScreen from "@components/LoadingScreen";
import PrivateRoute from "@components/common/PrivateRoute";
import PublicRoute from "@components/common/PublicRoute";
import MainLayout from "@layouts/MainLayout";

// 🚀 Ленивые страницы
const Dashboard = lazy(() => import("@pages/Dashboard"));
const Login = lazy(() => import("@pages/Login"));
const NotFoundPage = lazy(() => import("@pages/NotFoundPage"));
const Users = lazy(() => import("@pages/Users"));
const Analytics = lazy(() => import("@pages/Analytics"));
const Settings = lazy(() => import("@pages/Settings"));
const UserManagement = lazy(() => import("@pages/admin/UserManagement"));
const SystemSettings = lazy(() => import("@pages/admin/SystemSettings"));
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage/UnauthorizedPage"));

/**
 * Корневой маршрутизатор приложения
 */
const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* 🔹 Публичная зона */}
        <Route
          path="/login"
          element={
            <PublicRoute restricted>
              <Login />
            </PublicRoute>
          }
        />
        
        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

        {/* 🔹 Приватная зона с MainLayout */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            
            {/* 🔹 Админские маршруты */}
            <Route path="admin">
              <Route path="users" element={<UserManagement />} />
              <Route path="system" element={<SystemSettings />} />
            </Route>
          </Route>
        </Route>

        {/* 🔹 Страница 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;