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
  CheckCircle,
  Download,
  ExclamationTriangle,
  PencilSquare,
  PlusCircle,
  Search,
  ShieldLock,
  ToggleOff,
  ToggleOn,
  Trash,
  XCircle,
} from "react-bootstrap-icons";

/** Типизация VPN-пользователя */
interface VpnUser {
  id: number;
  username: string;
  ip_address: string;
  role: "user" | "admin";
  is_active: boolean;
  connected: boolean;
  last_login?: string | null;
  group?: string; // FreeRADIUS realm
}

/** Моковые данные (имитация API) */
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
          group: "corp.satory.kz",
        },
        {
          id: 2,
          username: "petrov.vpn",
          ip_address: "10.216.88.25",
          role: "user",
          is_active: false,
          connected: false,
          last_login: "2025-11-09T09:15:00Z",
          group: "corp.satory.kz",
        },
        {
          id: 3,
          username: "sidorov.vpn",
          ip_address: "10.216.88.26",
          role: "user",
          is_active: true,
          connected: false,
          last_login: "2025-11-10T12:45:00Z",
          group: "guest.satory.kz",
        },
      ]);
    }, 400)
  );

export default function VpnUsersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [users, setUsers] = useState<VpnUser[]>([]);
  const [filtered, setFiltered] = useState<VpnUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<VpnUser | null>(null);

  /** Загрузка списка */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchVpnUsers();
        setUsers(data);
        setFiltered(data);
      } catch {
        setError("Ошибка при загрузке VPN-пользователей");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /** Фильтрация */
  useEffect(() => {
    const query = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.username.toLowerCase().includes(query) ||
          u.ip_address.includes(query) ||
          (u.group?.toLowerCase().includes(query) ?? false)
      )
    );
  }, [search, users]);

  /** Действия */
  const handleAdd = () => alert("Добавление VPN-пользователя — в разработке");
  const handleEdit = (u: VpnUser) => alert(`Редактирование: ${u.username}`);
  const handleToggleActive = (id: number) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_active: !u.is_active } : u))
    );
  const handleDelete = (user: VpnUser) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setShowDeleteModal(false);
  };

  /** Экспорт в JSON */
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(users, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `vpn-users-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /** Компоненты UI */
  const RoleBadge = ({ role }: { role: "admin" | "user" }) => (
    <Badge bg={role === "admin" ? "danger" : "secondary"} className="px-3 py-2">
      {role === "admin" ? "Администратор" : "Пользователь"}
    </Badge>
  );

  const StatusBadge = ({ active }: { active: boolean }) =>
    active ? (
      <Badge bg="success">Активен</Badge>
    ) : (
      <Badge bg="secondary">Заблокирован</Badge>
    );

  const ConnectionIcon = ({ connected }: { connected: boolean }) =>
    connected ? (
      <CheckCircle className="text-success" />
    ) : (
      <XCircle className="text-danger" />
    );

  /** Разметка */
  return (
    <Card className={`p-4 shadow-sm ${isDark ? "bg-dark text-light" : "bg-white"}`}>
      {/* ───── HEADER ───── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 d-flex align-items-center gap-2">
            <ShieldLock /> VPN-пользователи
          </h4>
          <small className="text-muted">
            Управление учётными записями VPN RouterOS / FreeRADIUS / RADIUS Realm
          </small>
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

      {/* ───── FILTER BAR ───── */}
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <Search />
        </InputGroup.Text>
        <Form.Control
          placeholder="Поиск по логину, IP или группе..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={isDark ? "bg-dark text-light border-secondary" : ""}
        />
      </InputGroup>

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
          className={`align-middle rounded ${isDark ? "table-dark" : "table-light"}`}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Логин</th>
              <th>IP-адрес</th>
              <th>Группа (Realm)</th>
              <th>Роль</th>
              <th>Статус</th>
              <th className="text-center">Подключение</th>
              <th>Последний вход</th>
              <th className="text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                className={!u.is_active ? (isDark ? "opacity-75" : "text-muted") : ""}
              >
                <td className="fw-semibold">{u.id}</td>
                <td>{u.username}</td>
                <td>
                  <code>{u.ip_address}</code>
                </td>
                <td>
                  <Badge bg={isDark ? "info" : "light"} text={isDark ? "dark" : "dark"}>
                    {u.group || "—"}
                  </Badge>
                </td>
                <td>
                  <RoleBadge role={u.role} />
                </td>
                <td>
                  <StatusBadge active={u.is_active} />
                </td>
                <td className="text-center">
                  <ConnectionIcon connected={u.connected} />
                </td>
                <td>
                  {u.last_login
                    ? new Date(u.last_login).toLocaleString("ru-RU")
                    : "—"}
                </td>
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

                    <OverlayTrigger
                      overlay={
                        <Tooltip>
                          {u.is_active ? "Заблокировать" : "Разблокировать"}
                        </Tooltip>
                      }
                    >
                      <Button
                        size="sm"
                        variant={u.is_active ? "outline-warning" : "outline-success"}
                        onClick={() => handleToggleActive(u.id)}
                      >
                        {u.is_active ? <ToggleOff size={14} /> : <ToggleOn size={14} />}
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={<Tooltip>Удалить</Tooltip>}>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(u)}
                      >
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

      {/* ───── MODAL УДАЛЕНИЯ ───── */}
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
              Удалить VPN-пользователя <strong>{selectedUser.username}</strong>?
            </p>
          )}
          <Alert variant="warning" className="small">
            Это действие необратимо и приведет к удалению учётной записи из FreeRADIUS.
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
