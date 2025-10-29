import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/**
 * Атрибуты системного пользователя панели управления
 */
export interface SystemUserAttributes {
  id: number;
  username: string;                        // Логин
  email: string;                           // Корпоративная почта
  full_name?: string | null;               // ФИО
  password_hash: string;                   // bcrypt / argon2 hash
  role: "admin" | "operator" | "engineer" | "viewer"; // Ролевой доступ
  department?: string | null;              // Отдел / подразделение
  phone?: string | null;                   // Телефон для 2FA или уведомлений
  last_login_at?: Date | null;             // Последний вход
  last_ip?: string | null;                 // IP последнего входа
  two_factor_enabled: boolean;             // Включён ли 2FA
  two_factor_secret?: string | null;       // Секрет для TOTP
  is_active: boolean;                      // Активен ли пользователь
  created_at?: Date;
  updated_at?: Date;
}

export type SystemUserCreationAttributes = Optional<
  SystemUserAttributes,
  | "id"
  | "full_name"
  | "department"
  | "phone"
  | "last_login_at"
  | "last_ip"
  | "two_factor_secret"
  | "created_at"
  | "updated_at"
>;

/**
 * 👤 Модель системного пользователя (панели управления)
 */
export class SystemUser
  extends Model<SystemUserAttributes, SystemUserCreationAttributes>
  implements SystemUserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public full_name?: string | null;
  public password_hash!: string;
  public role!: "admin" | "operator" | "engineer" | "viewer";
  public department?: string | null;
  public phone?: string | null;
  public last_login_at?: Date | null;
  public last_ip?: string | null;
  public two_factor_enabled!: boolean;
  public two_factor_secret?: string | null;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SystemUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: { len: [3, 64], is: /^[a-zA-Z0-9._-]+$/ },
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    full_name: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "bcrypt/argon2 hash пароля",
    },
 role: {
      type: DataTypes.ENUM("admin", "operator", "engineer", "viewer"),
      allowNull: false,
      defaultValue: "viewer"
    },
    department: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "Отдел / подразделение",
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: true,
      comment: "Контактный номер для SMS/2FA",
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    two_factor_secret: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: "TOTP секрет",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "system_users",
    schema: process.env.NODE_ENV === "development" ? "dev" : "public",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored: true,
    indexes: [
      { unique: true, fields: ["username"] },
      { unique: true, fields: ["email"] },
      { fields: ["role"] },
      { fields: ["is_active"] },
    ],
  }
);
