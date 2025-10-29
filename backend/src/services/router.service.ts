// src/services/router.service.ts
import { Router } from "../models";

export class RouterService {
  /**
   * Создание нового роутера
   */
  static async createRouter(data: {
    name: string;
    ip_address: string;
    type?: 'l2tp' | 'eoip' | 'vxlan' | 'wireguard' | 'ipsec' | 'pptp' | 'ovpn';
    location?: string;
    is_active?: boolean;
    interface_name?: string;
    os_version?: string;
    model?: string;
    management_port?: number;
    api_port?: number;
    comment?: string;
    metadata?: object;
  }) {
    return Router.create({
      name: data.name,
      ip_address: data.ip_address,
      type: data.type || 'l2tp',
      location: data.location,
      is_active: data.is_active ?? true,
      interface_name: data.interface_name,
      os_version: data.os_version,
      model: data.model,
      management_port: data.management_port ?? 8728,
      api_port: data.api_port ?? 80,
      comment: data.comment,
      metadata: data.metadata || {},
    });
  }

  /**
   * Получение роутера по ID
   */
  static async getRouterById(id: number) {
    return Router.findByPk(id);
  }

  /**
   * Обновление роутера
   */
  static async updateRouter(
    id: number,
    data: Partial<Omit<{
      name: string;
      ip_address: string;
      type?: 'l2tp' | 'eoip' | 'vxlan' | 'wireguard' | 'ipsec' | 'pptp' | 'ovpn';
      location?: string;
      is_active?: boolean;
      interface_name?: string;
      os_version?: string;
      model?: string;
      management_port?: number;
      api_port?: number;
      comment?: string;
      metadata?: object;
    }, 'id'>>
  ) {
    const router = await Router.findByPk(id);
    if (!router) throw new Error('Router not found');
    return router.update(data);
  }

  /**
   * Удаление роутера
   */
  static async deleteRouter(id: number) {
    const router = await Router.findByPk(id);
    if (!router) throw new Error('Router not found');
    return router.destroy();
  }

  /**
   * Поиск активных роутеров
   */
  static async getActiveRouters() {
    return Router.findAll({ where: { is_active: true } });
  }
}
