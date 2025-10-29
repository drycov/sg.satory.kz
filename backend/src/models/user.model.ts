import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/**
 * Типизация модели
 */
export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  ip_address: string;
  secret: string;
  is_active: boolean;
  role: "user" | "admin";
  last_login?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "last_login" | "created_at" | "updated_at" | "role"
>;


/**
 * Модель пользователя для VPN User Management System
 */
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public password!: string;
  public ip_address!: string;
  public secret!: string;
  public is_active!: boolean;
  public role!: "user" | "admin";
  public last_login?: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  /**
   * Проверка пароля
   */
}

/**
 * Инициализация модели
 */
User.init(
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
      validate: {
        len: [3, 64],
        is: /^[a-zA-Z0-9_.-]+$/i,
      },
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: "Хэшированный пароль (bcrypt)",
    },
    ip_address: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        isIP: true,
      },
    },
    secret: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: "Shared secret для FreeRADIUS / MikroTik PPP",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "users",
    schema: process.env.NODE_ENV === "development" ? "dev" : "public",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { unique: true, fields: ["username"] },
      { fields: ["ip_address"] },
    ],
    defaultScope: {
      attributes: { exclude: ["password", "secret"] },
    },
    hooks: {
      /**
       * Хэширование пароля перед сохранением
       */
    },
  }
);
