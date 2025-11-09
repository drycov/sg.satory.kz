import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import {
  Button,
  Container,
  Dropdown,
  Image,
  Nav,
  Navbar,
  Badge,
} from "react-bootstrap";
import {
  BoxArrowRight,
  Gear,
  List,
  Bell,
  PersonCircle,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { useAuthContext } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const { theme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuthContext();
  const isDark = theme === "dark";

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Пользователь успешно добавлен", time: "2 мин назад", type: "success" },
    { id: 2, title: "Ошибка авторизации RADIUS", time: "10 мин назад", type: "danger" },
    { id: 3, title: "Обновление системы запланировано на 03:00", time: "1 ч назад", type: "info" },
  ]);
  const unread = notifications.length;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <Navbar
      bg={theme}
      data-bs-theme={theme}
      expand="lg"
      className={`shadow-sm sticky-top w-100 py-2 px-3 border-bottom ${
        isDark ? "bg-dark" : "bg-white"
      }`}
      style={{
        transition: "background-color 0.3s ease, border-color 0.3s ease",
        backdropFilter: "blur(6px)",
      }}
    >
      <Container fluid className="d-flex align-items-center justify-content-between">
        {/* Левая часть */}
        <div className="d-flex align-items-center gap-2">
          <Button
            variant={isDark ? "outline-light" : "outline-dark"}
            className="d-lg-none p-1"
            onClick={toggleSidebar}
          >
            <List size={22} />
          </Button>

          <Navbar.Brand
            as={Link}
            to="/"
            className={`fw-bold fs-5 ms-1 ${isDark ? "text-light" : "text-dark"}`}
          >
            VPN Manager
          </Navbar.Brand>
        </div>

        {/* Правая часть */}
        <Nav className="align-items-center gap-3">
          {/* 🔔 Уведомления */}
          <Dropdown align="end">
            <Dropdown.Toggle
              as="div"
              role="button"
              className="no-caret position-relative cursor-pointer"
            >
              <Bell size={22} className={isDark ? "text-light" : "text-dark"} />
              {unread > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: "0.6rem" }}
                >
                  {unread}
                </Badge>
              )}
            </Dropdown.Toggle>

            <AnimatePresence>
              <motion.div
                key="notif-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <Dropdown.Menu
                  align="end"
                  className={`shadow border-0 mt-2 rounded-3 bg-${theme}`}
                  data-bs-theme={theme}
                  style={{
                    minWidth: "20rem",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid #e9ecef",
                  }}
                >
                  <Dropdown.Header className="fw-semibold">
                    Уведомления ({unread})
                  </Dropdown.Header>
                  {notifications.map((n) => (
                    <Dropdown.Item
                      key={n.id}
                      className="py-2"
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.filter((x) => x.id !== n.id)
                        )
                      }
                    >
                      <div className="d-flex align-items-start">
                        <Badge
                          bg={
                            n.type === "success"
                              ? "success"
                              : n.type === "danger"
                              ? "danger"
                              : "info"
                          }
                          className="me-2 mt-1"
                        >
                          &nbsp;
                        </Badge>
                        <div>
                          <div className="fw-semibold small">{n.title}</div>
                          <small className="text-muted">{n.time}</small>
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center text-muted small py-3">
                      Нет новых уведомлений
                    </div>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="text-center text-primary fw-semibold py-2"
                    onClick={() => setNotifications([])}
                  >
                    Очистить все
                  </Dropdown.Item>
                </Dropdown.Menu>
              </motion.div>
            </AnimatePresence>
          </Dropdown>

          {/* 🌗 Тоггл темы */}
          <div className="d-none d-md-flex">
            <ThemeToggle />
          </div>

          {/* 👤 Профиль */}
          <Dropdown align="end">
            <Dropdown.Toggle
              as="div"
              role="button"
              className="no-caret d-flex align-items-center cursor-pointer px-1 py-1 rounded-2 position-relative"
              style={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.6)",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  roundedCircle
                  width={32}
                  height={32}
                  className="border border-secondary-subtle"
                  alt={user.name}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 32,
                    height: 32,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    backgroundColor: isDark ? "#343a40" : "#e9ecef",
                    color: isDark ? "#f8f9fa" : "#212529",
                  }}
                >
                  {initials}
                </div>
              )}
              <Badge
                bg="success"
                className="position-absolute bottom-0 end-0 rounded-circle border border-white"
                style={{ width: 10, height: 10 }}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu
              align="end"
              className={`shadow-sm border-0 mt-2 rounded-3 bg-${theme}`}
              data-bs-theme={theme}
              style={{
                minWidth: "13rem",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid #e9ecef",
              }}
            >
              <Dropdown.Header className="px-3 pb-2">
                <div className="fw-semibold text-truncate" style={{ maxWidth: 150 }}>
                  {user?.name || "Неизвестный пользователь"}
                </div>
                <small className="text-muted d-block">
                  {user?.email || "Нет email"}
                </small>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to="/settings" className="py-2">
                <Gear className="me-2" /> Настройки
              </Dropdown.Item>
              <Dropdown.Item
                onClick={logout}
                className="text-danger fw-semibold py-2"
              >
                <BoxArrowRight className="me-2" /> Выйти
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
