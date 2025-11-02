import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import LoadingScreen from "./components/LoadingScreen";
import { captureException } from "./utils/logger";
import { toast, ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Fallback-компонент для ошибок
function AppFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="container py-5 text-center">
      <h4 className="text-danger mb-3">Ошибка приложения</h4>
      <p className="text-muted">{error?.message || "Неизвестная ошибка"}</p>
      <button
        className="btn btn-primary"
        onClick={() => resetErrorBoundary()}
      >
        Перезагрузить приложение
      </button>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
registerSW({ immediate: true });

const handleError = (error: Error, info?: React.ErrorInfo) => {
  console.error("🚨 Global error:", error, info);
  captureException(error);
  toast.error("Произошла ошибка. Повторите позже.", { autoClose: 6000 });
};

// Перехват необработанных promise
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  captureException(event.reason);
  toast.error("Произошла непредвиденная ошибка");
});

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={AppFallback} onError={handleError}>
      <Suspense fallback={<LoadingScreen />}>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar
            theme="colored"
            closeOnClick
            pauseOnHover
            draggable
          />
        </HelmetProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
