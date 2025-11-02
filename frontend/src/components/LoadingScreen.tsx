import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";

export default function LoadingScreen() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="d-flex flex-column align-items-center gap-3"
      >
        {/* Логотип */}
        <motion.img
          src="/logo.svg"
          alt="App Logo"
          width={90}
          height={90}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Спиннер */}
        <Spinner animation="border" role="status" variant="primary" />

        {/* Текст */}
        <h2 className="fs-5 fw-semibold mt-2">Загрузка панели...</h2>
        <p className="text-muted small mb-0">
          Пожалуйста, подождите — идёт инициализация приложения
        </p>
      </motion.div>
    </div>
  );
}
