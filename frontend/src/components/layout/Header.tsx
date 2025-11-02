import { useEffect, useState } from "react";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import {
  ArrowsFullscreen,
  Bell,
  BoxArrowRight,
  Gear,
  List,
  Moon,
  PersonCircle,
  Sun,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

/** Типизация пропсов */
interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  currentTheme: "light" | "dark";
}

/**
 * Компонент верхней панели навигации
 * Использует React Bootstrap и полностью реагирует на текущую тему
 */
export default function Header({
  onToggleSidebar,
  onToggleTheme,
  currentTheme,
}: HeaderProps) {
  const navigate = useNavigate();

  /** Состояние темы */
  const [theme, setTheme] = useState<"light" | "dark">(currentTheme);

  /** Синхронизация темы с body и localStorage */
  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  /** Переключение темы */
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    onToggleTheme();
  };

  /** Переключение полноэкранного режима */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch((err) =>
        console.warn("Fullscreen request failed:", err)
      );
    } else {
      void document.exitFullscreen();
    }
  };

  /** Выход из системы */
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login", { replace: true });
  };

  return (
    <Navbar
      bg="body"
      expand="lg"
      className="border-bottom shadow-sm px-3"
      sticky="top"
    >
      <Container fluid>
        {/* Левая часть — логотип */}
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="d-flex align-items-center gap-2 cursor-pointer"
          style={{ cursor: "pointer" }}
        >
          <img src="/logo.svg" alt="Логотип" height={30} />
          <span className="fw-semibold">VPN Manager</span>
        </Navbar.Brand>

        {/* Кнопка сворачивания сайдбара */}
        <Button
          variant="outline-secondary"
          size="sm"
          className="d-lg-none"
          onClick={onToggleSidebar}
          aria-label="Переключить боковую панель"
        >
          <List size={18} />
        </Button>

        {/* Правая зона */}
        <Nav className="align-items-center ms-auto flex-row gap-2">
          {/* Переключатель темы */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            title={`Переключить тему (${theme === "light" ? "тёмная" : "светлая"})`}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </Button>

          {/* Полноэкранный режим */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            title="Полноэкранный режим"
          >
            <ArrowsFullscreen size={16} />
          </Button>

          {/* Уведомления */}
          <Dropdown align="end">
            <Dropdown.Toggle
              as={Button}
              variant="outline"
              size="sm"
              className="position-relative"
              title="Уведомления"
            >
              <Bell size={16} />
              {/* Пример счётчика */}
              {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span> */}
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow-sm">
              <Dropdown.Header>Уведомления</Dropdown.Header>
              <Dropdown.Item disabled>Нет новых уведомлений</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => navigate("/notifications")}
                className="text-center text-primary"
              >
                Показать все
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Меню пользователя */}
          <Dropdown align="end">
            <Dropdown.Toggle
              as={Button}
              variant="outline"
              size="sm"
              className="d-flex align-items-center gap-2"
              title="Меню пользователя"
            >
              <PersonCircle size={18} />
              <span className="d-none d-md-inline">Admin</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow-sm">
              <Dropdown.Item
                onClick={() => navigate("/me")}
                className="d-flex align-items-center gap-2"
              >
                <PersonCircle size={16} /> Профиль
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => navigate("/settings")}
                className="d-flex align-items-center gap-2"
              >
                <Gear size={16} /> Настройки
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={handleLogout}
                className="d-flex align-items-center gap-2 text-danger"
              >
                <BoxArrowRight size={16} /> Выйти
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
