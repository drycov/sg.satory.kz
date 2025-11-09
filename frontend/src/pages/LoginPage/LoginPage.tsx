import { useState } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import { ShieldLock, PersonFill } from "react-bootstrap-icons";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import OverlayLoader from "@/components/OverlayLoader";
import { useAuthContext } from "@/context/AuthContext";

/**
 * Страница авторизации VPN User Manager
 * — с анимированным фоном и плавным появлением
 */
export default function LoginPage() {
  const { theme } = useTheme();
  const { login } = useAuthContext();
  const isDark = theme === "dark";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || "Ошибка авторизации");
      setLoading(false);
    }
  };

  const logoSrc = isDark ? "/logo_dark.png" : "/logo_light.png";

  return (
    <div
      className="position-relative d-flex align-items-center justify-content-center overflow-hidden"
      style={{
        height: "100vh",
        backgroundColor: isDark ? "#0d1117" : "#f5f6fa",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* 🔹 Анимированный фон */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          zIndex: 0,
          background: isDark
            ? "radial-gradient(circle at 30% 30%, rgba(13,110,253,0.15) 0%, transparent 70%), radial-gradient(circle at 80% 80%, rgba(111,66,193,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle at 40% 40%, rgba(13,110,253,0.1) 0%, transparent 70%), radial-gradient(circle at 70% 70%, rgba(111,66,193,0.05) 0%, transparent 70%)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* 🔸 Сетка поверх фона (тонкая, анимированная) */}
      <motion.div
        animate={{
          backgroundPositionX: ["0%", "100%"],
          backgroundPositionY: ["0%", "100%"],
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          zIndex: 0,
          opacity: isDark ? 0.15 : 0.05,
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 76%, transparent 77%)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* 🔹 Анимированная карточка входа */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="position-relative"
        style={{ zIndex: 2 }}
      >
        <Card
          className="shadow-lg p-4"
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
            color: isDark ? "#f8f9fa" : "#212529",
            border: "none",
            borderRadius: "18px",
          }}
        >
          <div className="text-center mb-4">
            <motion.img
              src={logoSrc}
              alt="VPN Manager Logo"
              width={100}
              height={100}
              className="mb-3 user-select-none"
              draggable={false}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <h4 className="fw-bold">VPN User Manager</h4>
            <p className="text-muted mb-0">
              Авторизация в корпоративной панели управления
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  variant="danger"
                  className="py-2 text-center"
                  onClose={() => setError("")}
                  dismissible
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Имя пользователя</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <PersonFill />
                </span>
                <Form.Control
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`border-start-0 ${
                    isDark ? "bg-dark text-light" : ""
                  }`}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Пароль</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <ShieldLock />
                </span>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`border-start-0 ${
                    isDark ? "bg-dark text-light" : ""
                  }`}
                  required
                />
              </div>
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              className="w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
              variant={isDark ? "light" : "dark"}
            >
              {loading && (
                <ClipLoader
                  size={18}
                  color={isDark ? "#000" : "#fff"}
                  speedMultiplier={0.9}
                />
              )}
              {loading ? "Вход..." : "Войти"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small className="text-muted">
              © 2025 Satory Company Ltd. Все права защищены.
            </small>
          </div>
        </Card>
      </motion.div>

      {/* Overlay при логине */}
      <OverlayLoader
        show={loading}
        message="Проверка данных и вход в систему..."
      />
    </div>
  );
}
