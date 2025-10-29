import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserIpAttributes {
  id: number;
  user_id: number;
  ip_pool_id: number;
  assigned_ip?: string;
  created_at?: Date;
}

export type UserIpCreationAttributes = Optional<
  UserIpAttributes,
  'id' | 'created_at' | 'assigned_ip'
>;

export class UserIp extends Model<UserIpAttributes, UserIpCreationAttributes>
  implements UserIpAttributes {
  public id!: number;
  public user_id!: number;
  public ip_pool_id!: number;
  public assigned_ip?: string;
  public readonly created_at?: Date;
}

UserIp.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    ip_pool_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'ip_pools', key: 'id' },
      onDelete: 'CASCADE',
    },
    assigned_ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
      validate: { isIP: true },
      comment: 'Конкретный IP, выданный пользователю из пула',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'user_ips',
    schema: process.env.NODE_ENV === 'development' ? 'dev' : 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['ip_pool_id'] },
      { unique: true, fields: ['assigned_ip'] },
    ],
  }
);
