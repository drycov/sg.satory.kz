// src/server.ts
import dotenv from "dotenv";
dotenv.config(); // ← единственное место, где вызываем

import app from "./app";
import { connectDB, sequelize } from "./config/database";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
