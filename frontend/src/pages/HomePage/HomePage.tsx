import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useOverlay } from "@/context/OverlayContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { showOverlay, hideOverlay } = useOverlay();

  const handleTestOverlay = async () => {
    showOverlay("Тестовое включение Overlay… 🚀");
    await new Promise((r) => setTimeout(r, 2500)); // эмуляция загрузки
    hideOverlay();
  };

  return (
    <Card className="p-4 shadow-sm">
      <h4 className="mb-3">Главная панель</h4>
      <p className="text-muted">
        Добро пожаловать в корпоративную систему управления VPN-пользователями.
      </p>

      <div className="d-flex gap-3 mt-3">
        <Button variant="primary" onClick={() => navigate("/users")}>
          Перейти к списку пользователей
        </Button>

        <Button variant="outline-secondary" onClick={handleTestOverlay}>
          🔄 Проверить Overlay
        </Button>
      </div>
    </Card>
  );
}
