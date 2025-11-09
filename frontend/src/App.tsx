
import RouteController from "@routes/RouteController";
import { OverlayProvider } from "./context/OverlayContext";

/**
 * Главный layout приложения:
 * ┌─────────────────────────────┐
 * │ Header (фиксированный)     │
 * ├───────────────┬────────────┤
 * │ Sidebar       │ Контент    │
 * └───────────────┴────────────┘
 */
export default function App() {

  return (
    <OverlayProvider>
      <RouteController />
    </OverlayProvider>

  );
}
