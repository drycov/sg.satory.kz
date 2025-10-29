// src/services/ip-pool.service.ts
import { IpPool, UserIp } from "../models";
import { Address4 } from "ip-address";

export class IpPoolService {
    /**
     * Создание нового пула IP
     */
    static async createPool(data: {
        name: string;
        start_ip: string;
        end_ip: string;
        router_id: number;
        gateway?: string;
        group_id?: number;
        dns_servers?: string;
        is_active?: boolean;
    }) {
        return IpPool.create({
            ...data,
            is_active: data.is_active ?? true,
        });
    }

    /**
     * Получение всех пулов для роутера
     */
    static async getPoolsByRouter(router_id: number) {
        return IpPool.findAll({ where: { router_id } });
    }

    /**
     * Получение всех активных пулов
     */
    static async getActivePools() {
        return IpPool.findAll({ where: { is_active: true } });
    }

    /**
     * Поиск первого свободного IP в пуле
     */
    static async findFreeIp(pool: IpPool): Promise<string | null> {
        const assigned = await UserIp.findAll({
            where: { ip_pool_id: pool.id },
            attributes: ["assigned_ip"],
        });
        const used = new Set(assigned.map((u) => u.assigned_ip));

        const startAddr = new Address4(pool.start_ip);
        const endAddr = new Address4(pool.end_ip);

        let startInt: BigInteger = startAddr.bigInteger();
        const endInt: BigInteger = endAddr.bigInteger();

        while (startInt.compareTo(endInt) <= 0) {
            const candidate = Address4.fromBigInteger(startInt).address;
            if (!used.has(candidate)) return candidate;

            startInt = startInt.add(BigInteger.ONE);
        }

        return null;
    }

    /**
     * Обновление пула IP
     */
    static async updatePool(id: number, data: Partial<Omit<IpPool, 'id'>>) {
        const pool = await IpPool.findByPk(id);
        if (!pool) throw new Error("IpPool not found");
        return pool.update(data);
    }

    /**
     * Удаление пула IP
     */
    static async deletePool(id: number) {
        const pool = await IpPool.findByPk(id);
        if (!pool) throw new Error("IpPool not found");
        return pool.destroy();
    }
}
