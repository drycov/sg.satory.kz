import { User } from "../models/index";

/**
 * DTO для создания и обновления пользователя
 */
export interface CreateUserDTO {
  username: string;
  password: string;
  ip_address: string;
  secret: string;
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {
  is_active?: boolean;
}

/**
 * Сервис управления пользователями
 * Используется для CRUD и административных операций
 */
export class UserService {
  /**
   * Получение всех пользователей
   */
  static async getAllUsers() {
    try {
      const users = await User.findAll({
        order: [["id", "ASC"]],
        attributes: { exclude: ["password", "secret"] },
      });
      return users;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  /**
   * Создание нового пользователя
   */
  static async createUser(data: CreateUserDTO) {
    const { username, password, ip_address, secret } = data;

    if (!username || !password || !ip_address || !secret) {
      throw new Error("Missing required fields");
    }

    try {
      // Проверка уникальности username
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new Error(`User '${username}' already exists`);
      }

      // Хэширование пароля

      // Создание пользователя
      const user = await User.create({
        username,
        password: password,
        ip_address,
        secret,
        is_active: true,
      });

      console.log(`✅ User created successfully: ${username}`);
      return user;
    } catch (error) {
      console.error("❌ Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  /**
   * Получение пользователя по ID
   */
  static async getUserById(id: number) {
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password", "secret"] },
      });
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      console.error(`❌ Error fetching user with ID ${id}:`, error);
      throw new Error("Failed to fetch user");
    }
  }

  /**
   * Обновление данных пользователя
   */
  static async updateUser(id: number, data: UpdateUserDTO) {
    try {
      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found");


      await user.update(data);
      console.log(`🛠 User updated: ${user.username}`);
      return user;
    } catch (error) {
      console.error(`❌ Error updating user with ID ${id}:`, error);
      throw new Error("Failed to update user");
    }
  }

  /**
   * Деактивация пользователя (soft delete)
   */
  static async deactivateUser(id: number) {
    try {
      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found");

      await user.update({ is_active: false });
      console.log(`🧩 User deactivated: ${user.username}`);
      return user;
    } catch (error) {
      console.error(`❌ Error deactivating user with ID ${id}:`, error);
      throw new Error("Failed to deactivate user");
    }
  }

  /**
   * Удаление пользователя (hard delete)
   */
  static async deleteUser(id: number) {
    try {
      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found");

      await user.destroy();
      console.log(`🗑️ User deleted: ${user.username}`);
      return { message: "User deleted successfully" };
    } catch (error) {
      console.error(`❌ Error deleting user with ID ${id}:`, error);
      throw new Error("Failed to delete user");
    }
  }
}
