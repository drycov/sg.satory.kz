import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface IpPoolAttributes {
    id: number;
    name: string;
    start_ip: string;
    end_ip: string;
    gateway?: string | null;
    group_id?: number | null;
    dns_servers?: string | null;
    is_active: boolean;
    router_id: number; // 👈 добавляем связь
    created_at?: Date;
    updated_at?: Date;
}

export type IpPoolCreationAttributes = Optional<
    IpPoolAttributes,
    'id' | 'gateway' | 'dns_servers' | 'created_at' | 'updated_at'
>;

export class IpPool
    extends Model<IpPoolAttributes, IpPoolCreationAttributes>
    implements IpPoolAttributes {
    public id!: number;
    public name!: string;
    public start_ip!: string;
    public end_ip!: string;
    public gateway?: string | null;
    public group_id?: number | null;
    public dns_servers?: string | null;
    public is_active!: boolean;
    public router_id!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

IpPool.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
            validate: { len: [3, 64] },
        },
        start_ip: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: { isIP: true },
        },
        end_ip: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: { isIP: true },
        },
        gateway: {
            type: DataTypes.STRING(45),
            allowNull: true,
            validate: { isIP: true },
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "assignment_groups", key: "id" },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        },
        dns_servers: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'DNS через запятую (например, 8.8.8.8,1.1.1.1)',
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        router_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'routers', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
        tableName: 'ip_pools',
        schema: process.env.NODE_ENV === 'development' ? 'dev' : 'public',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { unique: true, fields: ['name'] },
            { fields: ['router_id'] },
            { fields: ['is_active'] },
        ],
        comment: 'Диапазоны IP-адресов, закрепленные за конкретными роутерами',
    }
);
