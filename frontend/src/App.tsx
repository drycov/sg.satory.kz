import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./router/AppRoutes";

/**
 * Опорная точка приложения.
 * Подключает централизованный маршрутизатор и общие провайдеры.
 */
function App() {
  return (
    <AuthProvider>

      <AppRoutes />
    </AuthProvider>

  );
}

export default App;
