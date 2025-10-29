import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface RouterAttributes {
  id: number;
  name: string;
  ip_address: string;
  location?: string;
  is_active: boolean;
  type: 'l2tp' | 'eoip' | 'vxlan' | 'wireguard' | 'ipsec' | 'pptp' | 'ovpn';
  interface_name?: string;
  os_version?: string;
  model?: string;
  management_port?: number;
  api_port?: number;
  comment?: string;
  metadata?: object; // динамические параметры (JSONB)
}

export type RouterCreationAttributes = Optional<
  RouterAttributes,
  | 'id'
  | 'location'
  | 'is_active'
  | 'interface_name'
  | 'os_version'
  | 'model'
  | 'management_port'
  | 'api_port'
  | 'comment'
  | 'metadata'
>;

export class Router
  extends Model<RouterAttributes, RouterCreationAttributes>
  implements RouterAttributes
{
  public id!: number;
  public name!: string;
  public ip_address!: string;
  public location?: string;
  public is_active!: boolean;
  public type!: 'l2tp' | 'eoip' | 'vxlan' | 'wireguard' | 'ipsec' | 'pptp' | 'ovpn';
  public interface_name?: string;
  public os_version?: string;
  public model?: string;
  public management_port?: number;
  public api_port?: number;
  public comment?: string;
  public metadata?: object;
}

Router.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    ip_address: {
      type: DataTypes.STRING(45), // IPv4 или IPv6
      allowNull: false,
      validate: {
        isIP: true,
      },
    },
    location: DataTypes.STRING(128),
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    type: {
      type: DataTypes.ENUM(
        'l2tp',
        'eoip',
        'vxlan',
        'wireguard',
        'ipsec',
        'pptp',
        'ovpn'
      ),
      allowNull: false,
      defaultValue: 'l2tp',
    },
    interface_name: DataTypes.STRING(64),
    os_version: DataTypes.STRING(64),
    model: DataTypes.STRING(64),
    management_port: {
      type: DataTypes.INTEGER,
      defaultValue: 8728, // по умолчанию для RouterOS API
    },
    api_port: {
      type: DataTypes.INTEGER,
      defaultValue: 80, // web-интерфейс или API
    },
    comment: DataTypes.STRING(256),
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: 'routers',
    timestamps: true,
    indexes: [
      { fields: ['ip_address'] },
      { fields: ['type'] },
      { fields: ['is_active'] },
    ],
  }
);
