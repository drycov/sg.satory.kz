import { createContext, useContext, useState, type ReactNode } from "react";
import OverlayLoader from "@/components/OverlayLoader";

interface OverlayContextType {
  showOverlay: (message?: string) => void;
  hideOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string>("Загрузка...");

  const showOverlay = (msg?: string) => {
    setMessage(msg || "Загрузка...");
    setVisible(true);
  };

  const hideOverlay = () => {
    setVisible(false);
  };

  return (
    <OverlayContext.Provider value={{ showOverlay, hideOverlay }}>
      {children}

      {/* 🔹 Глобальный Overlay (всегда подключён, просто скрыт по умолчанию) */}
      <OverlayLoader show={visible} message={message} />
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
}
