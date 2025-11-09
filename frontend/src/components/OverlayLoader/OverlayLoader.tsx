import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

/**
 * Overlay-загрузчик для VPN Manager
 * — плавное появление/исчезновение
 * — пульсирующее свечение
 * — выбор фирменного логотипа под тему (dark/light)
 */
export default function OverlayLoader({
  show,
  message = "Загрузка...",
}: {
  show: boolean;
  message?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // выбор логотипа в зависимости от темы
  const logoSrc = isDark ? "/logo_dark.png" : "/logo_light.png";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
          style={{
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.65)"
              : "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(8px)",
            zIndex: 1050,
          }}
        >
          {/* Контейнер логотипа */}
          <div className="position-relative d-flex justify-content-center align-items-center">
            {/* Пульсирующее свечение */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 2.6,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: isDark
                  ? "radial-gradient(circle, rgba(13,110,253,0.35), transparent 70%)"
                  : "radial-gradient(circle, rgba(13,110,253,0.25), transparent 70%)",
                filter: "blur(10px)",
              }}
            />

            {/* Вращающийся логотип */}
            <motion.img
              src={logoSrc}
              alt="VPN Manager Logo"
              width={95}
              height={95}
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "linear",
              }}
              style={{
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Сообщение */}
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="fw-semibold mt-4"
              style={{
                color: isDark ? "#f1f1f1" : "#333",
                textShadow: isDark
                  ? "0 1px 2px rgba(0,0,0,0.6)"
                  : "0 1px 2px rgba(255,255,255,0.6)",
                fontSize: "1rem",
              }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
