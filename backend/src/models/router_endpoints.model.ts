import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Router } from './router.model';

interface RouterEndpointAttributes {
  id: number;
  router_id: number;
  endpoint_ip: string;
  endpoint_name?: string;
  tunnel_type: 'l2tp' | 'eoip' | 'vxlan' | 'ipsec' | 'wireguard';
  shared_secret?: string;
  is_active: boolean;
  comment?: string;
  metadata?: object;
}

interface RouterEndpointCreationAttributes
  extends Optional<RouterEndpointAttributes, 'id' | 'endpoint_name' | 'shared_secret' | 'is_active' | 'comment' | 'metadata'> {}

export class RouterEndpoint
  extends Model<RouterEndpointAttributes, RouterEndpointCreationAttributes>
  implements RouterEndpointAttributes {
  public id!: number;
  public router_id!: number;
  public endpoint_ip!: string;
  public endpoint_name?: string;
  public tunnel_type!: 'l2tp' | 'eoip' | 'vxlan' | 'ipsec' | 'wireguard';
  public shared_secret?: string;
  public is_active!: boolean;
  public comment?: string;
  public metadata?: object;
}

RouterEndpoint.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    router_id: { type: DataTypes.INTEGER, allowNull: false },
    endpoint_ip: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: { isIP: true },
    },
    endpoint_name: DataTypes.STRING(128),
    tunnel_type: {
      type: DataTypes.ENUM('l2tp', 'eoip', 'vxlan', 'ipsec', 'wireguard'),
      allowNull: false,
    },
    shared_secret: DataTypes.STRING(128),
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    comment: DataTypes.STRING(256),
    metadata: { type: DataTypes.JSONB, defaultValue: {} },
  },
  {
    sequelize,
    tableName: 'router_endpoints',
    timestamps: true,
    indexes: [{ fields: ['router_id'] }, { fields: ['endpoint_ip'] }],
  }
);

// Ассоциация с Router
