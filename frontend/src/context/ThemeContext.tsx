import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** Тип доступных тем */
type Theme = "light" | "dark";

/** Контекст с текущей темой и функцией переключения */
interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

/** Создание контекста */
const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
});

/** Провайдер темы */
export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const getPreferredTheme = (): Theme => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) return saved;

    // Проверка системных настроек
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  };

  const [theme, setTheme] = useState<Theme>(getPreferredTheme);

  /** Применение темы и плавного перехода */
  useEffect(() => {
    // Добавляем плавный переход
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";

    // Устанавливаем тему для Bootstrap 5.3+
    document.body.dataset.bsTheme = theme;

    // Сохраняем выбранную тему
    localStorage.setItem("theme", theme);
  }, [theme]);

  /** Реакция на системное изменение темы */
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  /** Переключение темы вручную */
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/** Хук для удобного использования контекста */
export const useTheme = () => useContext(ThemeContext);
