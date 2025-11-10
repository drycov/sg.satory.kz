import { Container } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import { Outlet } from "react-router-dom";

/**
 * DashboardLayout — основная структура приватной части VPN Manager
 * ┌─────────────────────────────┐
 * │ Header (фиксированный top) │
 * ├───────────────┬────────────┤
 * │ Sidebar       │ Контент    │
 * └───────────────┴────────────┘
 */
export default function DashboardLayout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sidebarWidth = 250; // можно вынести в const / theme vars

  return (
    <div
      className={`d-flex flex-column bg-${theme} text-${isDark ? "light" : "dark"}`}
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Верхняя панель */}
      <Header />

      <div
        className="d-flex flex-grow-1 position-relative"
        style={{
          height: "calc(100vh - 64px)", // 64px — высота Header
          overflow: "hidden",
        }}
      >
        {/* Боковая панель */}
        <aside
          className="d-none d-lg-block border-end"
          style={{
            width: `${sidebarWidth}px`,
            backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
            boxShadow: isDark
              ? "2px 0 6px rgba(0,0,0,0.4)"
              : "2px 0 6px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
            zIndex: 10,
          }}
        >
          <Sidebar />
        </aside>

        {/* Контент */}
        <main
          className="flex-grow-1 py-4 px-3 px-lg-4 position-relative"
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            height: "100%",
            backgroundColor: isDark ? "#2b2b2b" : "#f8f9fa",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          <Container fluid className="pb-5">
            <Outlet />
          </Container>

          {/* Глобальный footer / статус */}
          <footer
            className="text-center small mt-auto py-3 text-muted"
            style={{
              borderTop: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.1)",
              fontSize: "0.85rem",
            }}
          >
            © 2025 Satory Company Ltd · VPN Manager Dashboard
          </footer>
        </main>
      </div>

      {/* Мобильный Offcanvas Sidebar */}
      <div className="d-lg-none">
        <Sidebar />
      </div>
    </div>
  );
}
