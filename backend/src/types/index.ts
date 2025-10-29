/**
 * Global Type Declarations
 * -------------------------
 * Централизованные типы для моделей, сервисов и API-контрактов.
 * Используется во всех слоях приложения (Controller / Service / DB / Front).
 */

export interface IUser {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserCreate {
  username: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

export interface IUserUpdate {
  email?: string;
  password?: string;
  role?: "admin" | "user";
  isActive?: boolean;
}

export interface IUserResponse {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Auth-related types
 */
export interface IAuthPayload {
  userId: number;
  role: "admin" | "user";
}

export interface IAuthResponse {
  token: string;
  user: IUserResponse;
}

/**
 * API стандартный ответ
 */
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Sequelize model generic type
 */
export type SequelizeModel<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};
