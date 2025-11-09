import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Card className="p-5 text-center shadow-sm">
            <h3 className="text-danger mb-3">404 — Страница не найдена</h3>
            <p className="text-muted mb-4">
                Запрошенная страница не существует или была перемещена.
            </p>
            <Button variant="primary" onClick={() => navigate("/")}>
                Вернуться на главную
            </Button>
        </Card>
    );
}
