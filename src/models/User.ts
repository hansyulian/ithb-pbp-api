import { Column, DataType, Table } from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";
export const userRoles = ["admin", "common"] as const;
export type UserRole = (typeof userRoles)[number];
export const userStatuses = ["pending", "active", "suspended"] as const;
export type UserStatus = (typeof userStatuses)[number];
export type UserAttributes = BaseAttributes & {
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  resetToken?: string;
  resetTokenExpiry?: Date;
  lastLoginAt?: Date;
};
export type UserCreationAttributes = CreateOmit<UserAttributes, "status">;
export type UserUpdateAttributes = UpdateOmit<
  Partial<UserAttributes>,
  "status" | "email"
>;

export type UserSequelizeCreationAttributes =
  SequelizeCreationPreset<UserCreationAttributes>;

export type UserProfileUpdatePayload = Partial<
  Pick<UserAttributes, "name" | "email" | "password">
>;

@Table({
  paranoid: true,
})
export class User extends BaseModel<
  UserAttributes,
  UserSequelizeCreationAttributes
> {
  @Column({ type: DataType.STRING })
  declare name: string;

  @Column({ type: DataType.STRING })
  declare email: string;

  @Column({ type: DataType.STRING })
  declare password: string;

  @Column({ type: DataType.ENUM(...userStatuses) })
  declare status: UserStatus;

  @Column({ type: DataType.ENUM(...userRoles) })
  declare role: UserRole;

  @Column({ type: DataType.STRING, allowNull: true })
  declare resetToken: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare resetTokenExpiry: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare lastLoginAt: Date;
}
