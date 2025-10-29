// services/user-assignment.service.ts
import { Op } from "sequelize";
import { IpPool,UserIp,User,AssignmentGroup } from "../models/index";
import { Address4 } from "ip-address";

export class UserAssignmentService {
  /**
   * Назначает пользователю IP-адрес из пула по группе назначения
   */
  static async assignIpToUser(user: User, groupName: string): Promise<UserIp> {
    const group = await AssignmentGroup.findOne({
      where: { name: groupName, is_active: true },
    });
    if (!group) throw new Error(`Группа назначения ${groupName} не найдена`);

    const pools = await IpPool.findAll({
      where: { group_id: group.id, is_active: true },
    });
    if (!pools.length) throw new Error(`Нет активных пулов в группе ${groupName}`);

    for (const pool of pools) {
      const freeIp = await this.findFreeIpInPool(pool);
      if (freeIp) {
        const assigned = await UserIp.create({
          user_id: user.id,
          ip_pool_id: pool.id,
          assigned_ip: freeIp,
        });

        // Обновляем IP в профиле пользователя (если нужно)
        await user.update({ ip_address: freeIp });

        return assigned;
      }
    }

    throw new Error(`Свободные IP не найдены в группе ${groupName}`);
  }

  /**
   * Находит первый свободный IP в диапазоне пула
   */
  static async findFreeIpInPool(pool: IpPool): Promise<string | null> {
    const assigned = await UserIp.findAll({
      where: { ip_pool_id: pool.id },
      attributes: ["assigned_ip"],
    });
    const used = new Set(assigned.map((u) => u.assigned_ip));

    const range = new Address4(pool.start_ip + "/24");
    const startStr = range.startAddress().address;
    const endStr = range.endAddress().address;

    const ipToInt = (ip: string): number =>
      ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;

    const intToIp = (num: number): string =>
      [(num >>> 24) & 0xff, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff].join(".");

    const start = ipToInt(startStr);
    const end = ipToInt(endStr);

    for (let ip = start; ip <= end; ip++) {
      const candidate = intToIp(ip);
      if (!used.has(candidate)) return candidate;
    }

    return null;
  }
}
