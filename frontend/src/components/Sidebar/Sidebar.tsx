import { NavLink } from "react-router-dom";
import { Offcanvas, Nav, Button } from "react-bootstrap";
import {
  HouseDoor,
  People,
  Gear,
  MoonStars,
  Sun,
  ShieldCheck,
} from "react-bootstrap-icons";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";

/**
 * Боковая панель навигации (Sidebar)
 * — адаптивна: Offcanvas на мобильных, статична на десктопе
 * — полностью управляется через SidebarContext
 */
export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { isOpen, closeSidebar } = useSidebar();

const navLinks = [
  { to: "/", icon: <HouseDoor />, label: "Главная" },
  { to: "/users", icon: <People />, label: "Пользователи" },
  { to: "/vpn-users", icon: <ShieldCheck />, label: "VPN User Manager" },
  { to: "/settings", icon: <Gear />, label: "Настройки" },
];

  const activeBg = theme === "light" ? "dark" : "light";
  const activeText = theme === "light" ? "white" : "black";

  return (
    <>
      {/* Sidebar для десктопа */}
      <div
        className={`d-none d-lg-flex flex-column p-3 border-end vh-100 position-fixed bg-${
          theme === "light" ? "light" : "dark"
        } text-${theme === "light" ? "dark" : "light"} shadow-sm`}
        style={{ width: "250px", transition: "background-color 0.3s ease" }}
      >
        <Nav className="flex-column gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                [
                  "nav-link",
                  "d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none",
                  isActive
                    ? `bg-${activeBg} text-${activeText} fw-semibold shadow-sm`
                    : `text-${theme === "light" ? "dark" : "light"} opacity-75`,
                ].join(" ")
              }
              style={{
                transition: "all 0.2s ease-in-out",
              }}
            >
              <span className="fs-5">{link.icon}</span>
              <span className="flex-grow-1">{link.label}</span>
            </NavLink>
          ))}
        </Nav>

        <div className="mt-auto text-center border-top pt-3">
          <Button
            size="sm"
            variant={theme === "light" ? "outline-dark" : "outline-light"}
            onClick={toggleTheme}
            className="w-100"
          >
            {theme === "light" ? <MoonStars /> : <Sun />} Тема
          </Button>
        </div>
      </div>

      {/* Offcanvas для мобильных */}
      <Offcanvas
        show={isOpen}
        onHide={closeSidebar}
        placement="start"
        className={`bg-${theme} text-${theme === "light" ? "dark" : "light"}`}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Навигация</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "nav-link px-3 py-2 rounded-3",
                    isActive
                      ? `bg-${activeBg} text-${activeText} fw-semibold`
                      : `text-${theme === "light" ? "dark" : "light"} opacity-75`,
                  ].join(" ")
                }
                onClick={closeSidebar}
              >
                <span className="me-2">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </Nav>

          <div className="mt-4 text-center border-top pt-3">
            <Button
              size="sm"
              variant={theme === "light" ? "outline-dark" : "outline-light"}
              onClick={toggleTheme}
              className="w-100"
            >
              {theme === "light" ? <MoonStars /> : <Sun />} Тема
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
