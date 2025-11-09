import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface UserProfile {
  username: string;
  name: string;
  email: string;
  avatar: string;
  role?:string;
}

/**
 * Хук авторизации и профиля пользователя
 * — управляет логином, логаутом и хранением данных
 */
export function useAuth() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // При загрузке проверяем токен и профиль
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("auth_user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  /** Вход в систему */
  const login = useCallback(
    (username: string, password: string) => {
      if (username === "admin" && password === "admin") {
        const profile: UserProfile = {
          username,
          name: "Администратор",
          email: "admin@satory.kz",
          avatar: "https://ui-avatars.com/api/?name=satory+satory&background=0d6efd&color=fff",
          role: "administrator",
        };
        localStorage.setItem("auth_token", "mock_token_123");
        localStorage.setItem("auth_user", JSON.stringify(profile));

        setUser(profile);
        setIsAuthenticated(true);
        navigate("/", { replace: true });
      } else {
        throw new Error("Неверное имя пользователя или пароль");
      }
    },
    [navigate]
  );

  /** Выход */
  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  /** Проверка токена */
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("auth_token");
    return !!token;
  }, []);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}

export default useAuth;
