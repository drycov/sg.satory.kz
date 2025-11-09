import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners"; // ✅ из react-spinners

/**
 * Анимированный экран загрузки
 * - Центрируется по viewport
 * - Поддерживает тёмную/светлую тему
 * - Использует react-spinners ClipLoader вокруг логотипа
 */
export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="loading-screen position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="d-flex flex-column align-items-center gap-4"
          >
            {/* Контейнер логотипа со спиннером */}
            <div className="position-relative d-inline-flex justify-content-center align-items-center">
              {/* Внешний ClipLoader вращается вокруг логотипа */}
              <div
                className="position-absolute d-flex justify-content-center align-items-center"
                style={{ width: 110, height: 110 }}
              >
                <ClipLoader
                  color="var(--bs-primary)"
                  size={100}
                  speedMultiplier={0.9}
                  loading
                />
              </div>

              {/* Логотип */}
              <motion.img
                src="/logo.svg"
                alt="App Logo"
                width={70}
                height={70}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            {/* Текст */}
            <div className="text-center">
              <h2 className="fs-5 fw-semibold mt-2 mb-1">Загрузка панели...</h2>
              <p className="text-muted small mb-0">
                Пожалуйста, подождите — идёт инициализация приложения
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
