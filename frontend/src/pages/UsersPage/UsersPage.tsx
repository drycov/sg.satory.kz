import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Badge,
  Button,
  Card,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip,
  Modal,
  Stack,
} from "react-bootstrap";
import {
  Person,
  PlusCircle,
  PencilSquare,
  Trash,
  ToggleOn,
  ToggleOff,
  CheckCircle,
  XCircle,
  ExclamationTriangle,
  People,
} from "react-bootstrap-icons";
import { useTheme } from "@/context/ThemeContext";

/** Типизация пользователя */
interface User {
  id: number;
  username: string;
  ip_address: string;
  role: "user" | "admin";
  is_active: boolean;
}

/** Моковые данные */
const fetchUsers = (): Promise<User[]> =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        { id: 1, username: "ivanov.vpn", ip_address: "10.216.88.24", role: "admin", is_active: true },
        { id: 2, username: "petrov.vpn", ip_address: "10.216.88.25", role: "user", is_active: false },
        { id: 3, username: "sidorov.vpn", ip_address: "10.216.88.26", role: "user", is_active: true },
      ]);
    }, 400)
  );

export default function UsersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /** ─── Загрузка списка ─── */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch {
        setError("Не удалось загрузить список пользователей");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /** ─── Обработчики ─── */
  const handleToggleActive = useCallback((id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_active: !u.is_active } : u))
    );
  }, []);

  const handleDelete = useCallback((user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setShowDeleteModal(false);
  }, [selectedUser]);

  const handleAdd = () => alert("Добавление пользователя — в разработке");
  const handleEdit = (u: User) => alert(`Редактирование: ${u.username}`);

  /** ─── Компоненты UI ─── */
  const RoleBadge = ({ role }: { role: "admin" | "user" }) => (
    <Badge bg={role === "admin" ? "danger" : "secondary"} className="px-3 py-2">
      {role === "admin" ? "Администратор" : "Пользователь"}
    </Badge>
  );

  const StatusIcon = ({ active }: { active: boolean }) =>
    active ? (
      <OverlayTrigger overlay={<Tooltip>Активен</Tooltip>}>
        <CheckCircle className="text-success" />
      </OverlayTrigger>
    ) : (
      <OverlayTrigger overlay={<Tooltip>Заблокирован</Tooltip>}>
        <XCircle className="text-danger" />
      </OverlayTrigger>
    );

  const activeCount = users.filter((u) => u.is_active).length;
  const inactiveCount = users.length - activeCount;

  /** ─── Разметка ─── */
  return (
    <Card className={`p-4 shadow-sm ${isDark ? "bg-dark text-light" : "bg-white"}`}>
      {/* ───── HEADER ───── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 d-flex align-items-center gap-2">
            <People /> Системные пользователи
          </h4>
          <small className="text-muted">
            Управление учётными записями VPN / FreeRADIUS / MikroTik
          </small>
        </div>

        <Button variant={isDark ? "success" : "primary"} onClick={handleAdd}>
          <PlusCircle className="me-1" /> Добавить
        </Button>
      </div>

      {/* ───── СТАТИСТИКА ───── */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <Badge bg="success" pill>
          Активных: {activeCount}
        </Badge>
        <Badge bg="secondary" pill>
          Заблокированных: {inactiveCount}
        </Badge>
        <Badge bg="info" pill>
          Всего: {users.length}
        </Badge>
      </div>

      {/* ───── Ошибка / Загрузка / Таблица ───── */}
      {error && (
        <Alert variant="danger" className="d-flex align-items-center gap-2">
          <ExclamationTriangle /> {error}
        </Alert>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant={isDark ? "light" : "primary"} />
        </div>
      ) : users.length === 0 ? (
        <Alert variant={isDark ? "secondary" : "light"} className="text-center py-4">
          <Person size={48} className="mb-2 opacity-50" />
          <div>Пользователи не найдены</div>
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table
            hover
            bordered
            size="sm"
            className={`align-middle rounded ${isDark ? "table-dark" : "table-light"}`}
          >
            <thead>
              <tr>
                <th style={{ width: 60 }}>#</th>
                <th>Логин</th>
                <th>IP-адрес</th>
                <th>Роль</th>
                <th className="text-center" style={{ width: 100 }}>Статус</th>
                <th className="text-center" style={{ width: 150 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className={!u.is_active ? (isDark ? "opacity-75" : "text-muted") : ""}
                >
                  <td className="fw-semibold">{u.id}</td>
                  <td className="fw-medium">{u.username}</td>
                  <td>
                    <code>{u.ip_address}</code>
                  </td>
                  <td>
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="text-center">
                    <StatusIcon active={u.is_active} />
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
        </div>
      )}

      {/* ───── MODAL УДАЛЕНИЯ ───── */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className={isDark ? "bg-dark text-light" : ""}>
          <Modal.Title className="d-flex align-items-center gap-2">
            <ExclamationTriangle className="text-danger" /> Подтверждение удаления
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          {selectedUser && (
            <p>
              Вы уверены, что хотите удалить пользователя{" "}
              <strong>{selectedUser.username}</strong>?
            </p>
          )}
          <Alert variant="warning" className="small">
            Это действие нельзя отменить.
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
