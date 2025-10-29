import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

interface UserProfileAttributes {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  department?: string;
  created_at?: Date;
  updated_at?: Date;
}

type UserProfileCreationAttributes = Optional<UserProfileAttributes, 'id' | 'created_at' | 'updated_at'>;

export class UserProfile extends Model<UserProfileAttributes, UserProfileCreationAttributes>
  implements UserProfileAttributes {
  public id!: number;
  public user_id!: number;
  public full_name!: string;
  public email!: string;
  public phone?: string;
  public department?: string;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;
}

UserProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_profiles',
    timestamps: true,
    underscored: true,
  }
);
