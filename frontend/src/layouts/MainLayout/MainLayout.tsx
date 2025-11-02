import { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Breadcrumb } from "react-bootstrap";

/**
 * DefaultLayout — базовый макет административной панели VPN Manager
 * Полностью на React-Bootstrap, с поддержкой тёмной темы и адаптивного sidebar.
 */
const DefaultLayout: React.FC = () => {
  /** --- Состояния --- */
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("app-theme") as "light" | "dark" | null;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  /** --- Константы геометрии --- */
  const SIDEBAR_EXPANDED = 250;
  const SIDEBAR_COLLAPSED = 80;
  const HEADER_HEIGHT = 56;

  /** --- Применение темы к body --- */
  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  /** --- Тогглы --- */
  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  /** --- Авто-сворачивание при ширине < 992px --- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992 && !collapsed) {
        setCollapsed(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  /** --- Расчёт динамической ширины sidebar --- */
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <div className="bg-body d-flex flex-column min-vh-100">
      {/* === Header === */}
      <header
        className="position-fixed top-0 end-0 border-bottom bg-body w-100 shadow-sm"
        style={{
          zIndex: 1050,
          marginLeft: sidebarWidth,
          height: HEADER_HEIGHT,
          transition: "margin-left 0.25s ease",
        }}
      >
        <Header
          onToggleSidebar={toggleSidebar}
          onToggleTheme={toggleTheme}
          currentTheme={theme}
        />
      </header>

      {/* === Sidebar === */}
      <Sidebar
        collapsed={collapsed}
        className="position-fixed start-0 border-end bg-body overflow-auto"
        style={{
          width: sidebarWidth,
          zIndex: 1040,
          top: HEADER_HEIGHT,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          transition: "width 0.25s ease",
        }}
      />

      {/* === Контент === */}
      <main
        className="flex-grow-1"
        style={{
          paddingTop: HEADER_HEIGHT,
          paddingLeft: sidebarWidth,
          transition: "padding-left 0.25s ease",
          backgroundColor: "var(--bs-body-bg)",
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <div className="bg-body-tertiary px-4 py-2 border-bottom">
  <Breadcrumb>
    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
    <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
  </Breadcrumb>
</div>

        <div className="container-fluid px-4 py-3">
          <Outlet />
        </div>
      </main>

      {/* === Footer === */}
      <footer
        className="bg-body-tertiary text-center text-muted small border-top py-3"
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.25s ease",
        }}
      >
        © {new Date().getFullYear()} Satory Company Ltd — Система управления
        VPN-доступом
      </footer>
    </div>
  );
};

export default DefaultLayout;
