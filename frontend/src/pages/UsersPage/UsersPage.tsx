import { useState } from "react";
import { Table, Badge, Button, Card } from "react-bootstrap";
import { PlusCircle, Person } from "react-bootstrap-icons";

interface User {
  id: number;
  username: string;
  ip_address: string;
  role: "user" | "admin";
  is_active: boolean;
}

export default function UsersPage() {
  const [users] = useState<User[]>([
    { id: 1, username: "ivanov.vpn", ip_address: "10.216.88.24", role: "admin", is_active: true },
    { id: 2, username: "petrov.vpn", ip_address: "10.216.88.25", role: "user", is_active: false },
  ]);

  return (
    <Card className="p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <Person className="me-2" />
          Пользователи VPN
        </h4>
        <Button variant="success">
          <PlusCircle className="me-1" /> Добавить
        </Button>
      </div>

      <Table hover responsive bordered className="align-middle">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Логин</th>
            <th>IP-адрес</th>
            <th>Роль</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.ip_address}</td>
              <td>
                <Badge bg={u.role === "admin" ? "primary" : "secondary"}>{u.role}</Badge>
              </td>
              <td>
                <Badge bg={u.is_active ? "success" : "danger"}>
                  {u.is_active ? "Активен" : "Заблокирован"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
