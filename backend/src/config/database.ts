import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_SSL,
  NODE_ENV,
} = process.env;

if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error("❌ Missing required database environment variables");
}

// Определяем схему в зависимости от окружения
const SCHEMA = NODE_ENV === "development" ? "dev" : "public";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT) || 5432,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  dialectOptions: {
    ssl: DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
  },
  logging: NODE_ENV === "development" ? console.log : false,
  define: {
    schema: SCHEMA, // указываем схему по умолчанию
    freezeTableName: true, // таблицы без автоматического добавления "s"
    timestamps: true,      // createdAt / updatedAt по умолчанию
  },
});

/**
 * Проверка и подключение к базе данных
 * В dev-режиме создаёт схему dev (если нет) и синхронизирует модели
 */
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ PostgreSQL connected successfully (${DB_NAME})`);

    // Создаём схему dev, если она не существует
    if (NODE_ENV === "development") {
      console.log("🧩 Development mode: ensuring 'dev' schema exists...");
      await sequelize.createSchema("dev", { logging: false }).catch(() => {});
    }

    // Синхронизация моделей
    if (NODE_ENV === "development") {
      console.log("🔄 Syncing models with 'dev' schema...");
      await sequelize.sync({ alter: true });
      console.log("✅ Models synchronized successfully");
    } else {
      console.log("🛡️ Production mode: using schema 'public' (no sync)");
    }
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};
