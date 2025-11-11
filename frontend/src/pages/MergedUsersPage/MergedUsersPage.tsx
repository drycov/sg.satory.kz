import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Form,
    InputGroup,
    Modal,
    OverlayTrigger,
    Spinner,
    Stack,
    Table,
    Tooltip,
} from "react-bootstrap";
import {
    Download,
    ExclamationTriangle,
    PencilSquare,
    PlusCircle,
    Search,
    ShieldLock,
    Trash
} from "react-bootstrap-icons";

/** ─────────── Типы ─────────── */
interface BaseUser {
  id: number;
  username: string;
  role: string;
  last_login?: string | null;
}

interface VpnUser extends BaseUser {
  ip_address: string;
  group?: string;
  connected: boolean;
  is_active: boolean;
}

interface SystemUser extends BaseUser {
  department?: string;
  email?: string;
}

interface UnifiedUser extends BaseUser {
  vpn?: VpnUser | null;
  system?: SystemUser | null;
  type: "vpn" | "system" | "both";
}

/** ─────────── Моки ─────────── */
const fetchVpnUsers = (): Promise<VpnUser[]> =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          id: 1,
          username: "ivanov.vpn",
          ip_address: "10.216.88.24",
          role: "admin",
          is_active: true,
          connected: true,
          last_login: "2025-11-10T21:20:00Z",
          group: "bdl",
        },
        {
          id: 2,
          username: "petrov.vpn",
          ip_address: "10.216.88.25",
          role: "user",
          is_active: false,
          connected: false,
          last_login: "2025-11-09T09:15:00Z",
          group: "bdl",
        },
      ]);
    }, 300)
  );

const fetchSystemUsers = (): Promise<SystemUser[]> =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          id: 11,
          username: "ivanov.vpn", // совпадает → объединится
          role: "admin",
          email: "ivanov@satory.kz",
          department: "NOC",
          last_login: "2025-11-10T21:22:00Z",
        },
        {
          id: 12,
          username: "sidorov.sys",
          role: "user",
          email: "sidorov@satory.kz",
          department: "Support",
          last_login: "2025-11-10T09:00:00Z",
        },
      ]);
    }, 300)
  );

/** ─────────── Утилита объединения ─────────── */
function mergeUsers(vpn: VpnUser[], system: SystemUser[]): UnifiedUser[] {
  const allUsernames = Array.from(
    new Set([...vpn.map((u) => u.username), ...system.map((u) => u.username)])
  );

  return allUsernames.map((username, index) => {
    const vpnUser = vpn.find((u) => u.username === username);
    const sysUser = system.find((u) => u.username === username);

    return {
      id: index + 1,
      username,
      role: vpnUser?.role || sysUser?.role || "user",
      last_login: vpnUser?.last_login || sysUser?.last_login || null,
      vpn: vpnUser || null,
      system: sysUser || null,
      type: vpnUser && sysUser ? "both" : vpnUser ? "vpn" : "system",
    };
  });
}

/** ─────────── Компонент ─────────── */
export default function MergedUsersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [users, setUsers] = useState<UnifiedUser[]>([]);
  const [filtered, setFiltered] = useState<UnifiedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "vpn" | "system" | "both">("all");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UnifiedUser | null>(null);

  /** ─────────── Загрузка данных ─────────── */
  useEffect(() => {
    const load = async () => {
      try {
        const [vpn, system] = await Promise.all([fetchVpnUsers(), fetchSystemUsers()]);
        const merged = mergeUsers(vpn, system);
        setUsers(merged);
        setFiltered(merged);
      } catch (e) {
        setError("Ошибка при загрузке пользователей");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /** ─────────── Фильтрация ─────────── */
  useEffect(() => {
    const query = search.toLowerCase();
    let list = users.filter(
      (u) =>
        u.username.toLowerCase().includes(query) ||
        u.vpn?.ip_address?.includes(query) ||
        u.vpn?.group?.toLowerCase().includes(query) ||
        u.system?.email?.toLowerCase().includes(query) ||
        u.system?.department?.toLowerCase().includes(query)
    );
    if (categoryFilter !== "all") {
      list = list.filter((u) => u.type === categoryFilter);
    }
    setFiltered(list);
  }, [search, categoryFilter, users]);

  /** ─────────── Действия ─────────── */
  const handleAdd = () => alert("Добавление пользователя — в разработке");
  const handleEdit = (u: UnifiedUser) => alert(`Редактирование: ${u.username}`);
  const handleDelete = (u: UnifiedUser) => {
    setSelectedUser(u);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.username !== selectedUser.username));
    setShowDeleteModal(false);
  };
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(users, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `merged-users-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /** ─────────── UI Компоненты ─────────── */
  const TypeBadge = ({ type }: { type: UnifiedUser["type"] }) => {
    const map = {
      both: { color: "info", label: "VPN + System" },
      vpn: { color: "primary", label: "VPN" },
      system: { color: "secondary", label: "System" },
    };
    const { color, label } = map[type];
    return <Badge bg={color}>{label}</Badge>;
  };

  return (
    <Card className={`p-4 shadow-sm ${isDark ? "bg-dark text-light" : "bg-white"}`}>
      {/* ───── HEADER ───── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 d-flex align-items-center gap-2">
            <ShieldLock /> Пользователи системы и VPN
          </h4>
          <small className="text-muted">Объединённая панель учётных записей</small>
        </div>

        <Stack direction="horizontal" gap={2}>
          <Button
            variant={isDark ? "outline-light" : "outline-secondary"}
            onClick={handleExport}
          >
            <Download className="me-1" /> Экспорт
          </Button>
          <Button variant={isDark ? "success" : "primary"} onClick={handleAdd}>
            <PlusCircle className="me-1" /> Добавить
          </Button>
        </Stack>
      </div>

      {/* ───── FILTERS ───── */}
      <Stack direction="horizontal" gap={2} className="mb-3 flex-wrap">
        <InputGroup className="flex-grow-1">
          <InputGroup.Text><Search /></InputGroup.Text>
          <Form.Control
            placeholder="Поиск по логину, IP, email или отделу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={isDark ? "bg-dark text-light border-secondary" : ""}
          />
        </InputGroup>

        <Form.Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as any)}
          className={isDark ? "bg-dark text-light border-secondary" : ""}
          style={{ maxWidth: "200px" }}
        >
          <option value="all">Все</option>
          <option value="vpn">VPN</option>
          <option value="system">System</option>
          <option value="both">Обе категории</option>
        </Form.Select>
      </Stack>

      {/* ───── Основной контент ───── */}
      {error && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <ExclamationTriangle /> {error}
        </Alert>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant={isDark ? "light" : "primary"} />
        </div>
      ) : filtered.length === 0 ? (
        <Alert variant={isDark ? "secondary" : "light"} className="text-center py-4">
          <ShieldLock size={48} className="mb-2 opacity-50" />
          <div>Пользователи не найдены</div>
        </Alert>
      ) : (
        <Table
          hover
          responsive
          bordered
          className={`align-middle ${isDark ? "table-dark" : "table-light"}`}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Логин</th>
              <th>Категория</th>
              <th>IP / Email</th>
              <th>Группа / Отдел</th>
              <th>Роль</th>
              <th>Последний вход</th>
              <th className="text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td><TypeBadge type={u.type} /></td>
                <td>
                  {u.vpn?.ip_address ? (
                    <code>{u.vpn.ip_address}</code>
                  ) : (
                    <span>{u.system?.email || "—"}</span>
                  )}
                </td>
                <td>{u.vpn?.group || u.system?.department || "—"}</td>
                <td>{u.role}</td>
                <td>{u.last_login ? new Date(u.last_login).toLocaleString("ru-RU") : "—"}</td>
                <td className="text-center">
                  <Stack direction="horizontal" gap={2} className="justify-content-center">
                    <OverlayTrigger overlay={<Tooltip>Редактировать</Tooltip>}>
                      <Button
                        size="sm"
                        variant={isDark ? "outline-light" : "outline-secondary"}
                        onClick={() => handleEdit(u)}
                      >
                        <PencilSquare size={14} />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={<Tooltip>Удалить</Tooltip>}>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(u)}>
                        <Trash size={14} />
                      </Button>
                    </OverlayTrigger>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ───── MODAL ───── */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className={isDark ? "bg-dark text-light" : ""}>
          <Modal.Title className="d-flex align-items-center gap-2">
            <ExclamationTriangle className="text-danger" />
            Подтверждение удаления
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          {selectedUser && (
            <p>
              Удалить пользователя <strong>{selectedUser.username}</strong> из системы?
            </p>
          )}
          <Alert variant="warning" className="small">
            Это действие необратимо и приведёт к удалению учётной записи.
          </Alert>
        </Modal.Body>
        <Modal.Footer className={isDark ? "bg-dark border-secondary" : ""}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Отмена
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <Trash /> Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
