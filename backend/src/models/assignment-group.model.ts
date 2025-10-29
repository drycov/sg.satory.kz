// models/assignment-group.model.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface AssignmentGroupAttributes {
  id: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type AssignmentGroupCreationAttributes = Optional<
  AssignmentGroupAttributes,
  "id" | "description" | "created_at" | "updated_at"
>;

export class AssignmentGroup
  extends Model<AssignmentGroupAttributes, AssignmentGroupCreationAttributes>
  implements AssignmentGroupAttributes
{
  public id!: number;
  public name!: string;
  public description?: string | null;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

AssignmentGroup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: "assignment_groups",
    schema: process.env.NODE_ENV === "development" ? "dev" : "public",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [{ unique: true, fields: ["name"] }],
  }
);
