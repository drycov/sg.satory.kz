import { Button } from "react-bootstrap";
import { MoonStars, Sun } from "react-bootstrap-icons";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={theme === "light" ? "outline" : "outline"}
      onClick={toggleTheme}
      className="rounded-circle p-2"
      title="Переключить тему"
    >
      {theme === "light" ? <MoonStars /> : <Sun />}
    </Button>
  );
}
