import { Container } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import { Outlet } from "react-router-dom";

/**
 * Layout для приватной части приложения (VPN Manager Dashboard)
 * ┌─────────────────────────────┐
 * │ Header (фиксированный)     │
 * ├───────────────┬────────────┤
 * │ Sidebar       │ Контент    │
 * └───────────────┴────────────┘
 */
export default function DashboardLayout() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      className={`d-flex flex-column bg-${theme} text-${
        isDark ? "light" : "dark"
      }`}
      style={{
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Верхняя панель */}
      <Header />

      <div
        className="d-flex flex-grow-1"
        style={{
          height: "calc(100vh - 64px)", // учёт высоты Header
          overflow: "hidden",
        }}
      >
        {/* Боковая панель */}
        <Sidebar />

        {/* Контент */}
        <main
          className="flex-grow-1 px-3 px-lg-4 py-4"
          style={{
            marginLeft: "250px",
            overflowY: "auto",
            overflowX: "hidden",
            height: "100%",
            backgroundColor: isDark ? "#2b2b2b" : "#f8f9fa",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          <Container fluid>
            <Outlet /> {/* 👈 Контент маршрута */}
          </Container>
        </main>
      </div>
    </div>
  );
}
