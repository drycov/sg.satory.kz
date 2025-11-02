import { useAuth } from "@/hooks/useAuth"; // исправленный путь для Vite alias
import { Nav } from "react-bootstrap";
import {
  Gear,
  GraphUp,
  People,
  PersonBadge,
  ShieldCheck,
  Speedometer2,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

/** Конфигурация пунктов меню */
interface NavItemConfig {
  to: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
  badge?: number;
}

/** Пропсы боковой панели */
interface SidebarProps {
  collapsed: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Пропсы функции для активного NavLink */
interface NavLinkProps {
  isActive: boolean;
  isCollapsed: boolean;
  hasBadge?: boolean;
}

/**
 * Компонент боковой панели
 * Реализован на React-Bootstrap без кастомных стилей
 */
export default function Sidebar({ collapsed, className = "", style = {} }: SidebarProps) {
  const { user, isAdmin } = useAuth();

  /** Статичная конфигурация навигации */
  const navItems: NavItemConfig[] = [
    { to: "/", icon: <Speedometer2 size={20} />, label: "Dashboard" },
    { to: "/users", icon: <People size={20} />, label: "Users", badge: 5 },
    { to: "/analytics", icon: <GraphUp size={20} />, label: "Analytics" },
    { to: "/settings", icon: <Gear size={20} />, label: "Settings" },
    {
      to: "/admin/users",
      icon: <PersonBadge size={20} />,
      label: "User Management",
      adminOnly: true,
    },
    {
      to: "/admin/system",
      icon: <ShieldCheck size={20} />,
      label: "System Settings",
      adminOnly: true,
    },
  ];

  /** Фильтруем по роли */
  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  const mainItems = filteredNavItems.filter((item) => !item.adminOnly);
  const adminItems = filteredNavItems.filter((item) => item.adminOnly);

  /** Унифицированные классы для NavLink */
  const getNavLinkClasses = ({
    isActive,
    isCollapsed,
  }: NavLinkProps): string => {
    const baseClasses = [
      "d-flex",
      "align-items-center",
      "px-3",
      "py-2",
      "rounded",
      "text-decoration-none",
      "transition-all",
      isCollapsed ? "justify-content-center" : "gap-3",
    ].join(" ");

    const stateClasses = isActive
      ? "bg-primary text-white shadow-sm"
      : "text-body hover-bg-light";

    return `${baseClasses} ${stateClasses}`;
  };

  const badgeClasses =
    "position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger";

  return (
    <aside
      className={`bg-body border-end overflow-auto position-sticky ${className}`}
      style={style}
    >
      <div className="d-flex flex-column h-100 pt-3">
        {/* Заголовок */}
        {!collapsed && (
          <div className="px-3 mb-4">
            <h5 className="text-primary fw-bold mb-1">Admin Panel</h5>
            <small className="text-muted">
              Welcome, {user?.name ?? "Guest"}
            </small>
          </div>
        )}

        {/* Основное меню */}
        <Nav className="flex-column w-100 px-2">
          {mainItems.map((item) => (
            <Nav.Item key={item.to} className="mb-1 position-relative">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  getNavLinkClasses({
                    isActive,
                    isCollapsed: collapsed,
                    hasBadge: !!item.badge,
                  })
                }
                title={collapsed ? item.label : undefined}
                end={item.to === "/"} // exact match for root
              >
                {item.icon}
                {!collapsed && (
                  <>
                    <span className="flex-grow-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="badge bg-primary rounded-pill ms-auto">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </>
                )}

                {collapsed && item.badge && item.badge > 0 && (
                  <span className={badgeClasses}>
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </NavLink>
            </Nav.Item>
          ))}
        </Nav>

        {/* Админ-раздел */}
        {adminItems.length > 0 && (
          <div className="mt-auto px-2 pb-3">
            <div className="border-top border-secondary-subtle pt-3 mt-3">
              {!collapsed && (
                <div className="px-3 mb-2">
                  <small className="text-muted fw-semibold text-uppercase">
                    Administration
                  </small>
                </div>
              )}

              <Nav className="flex-column w-100">
                {adminItems.map((item) => (
                  <Nav.Item key={item.to} className="mb-1">
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        getNavLinkClasses({
                          isActive,
                          isCollapsed: collapsed,
                        })
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      {item.icon}
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </Nav.Item>
                ))}
              </Nav>
            </div>
          </div>
        )}

        {/* Мини-аватар снизу при свернутом меню */}
        {collapsed && (
          <div className="text-center mt-auto p-3 border-top">
            <div
              className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              title={user?.name ?? "User"}
            >
              <span className="text-white small fw-bold">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}