import { Column, DataType, DeletedAt, Model } from "sequelize-typescript";
import { v4 } from "uuid";

export abstract class BaseModel<
  ModelAttributes extends {},
  ModelCreationAttributes extends {}
> extends Model<ModelAttributes, ModelCreationAttributes> {
  @Column({
    primaryKey: true,
    defaultValue: v4,
    type: DataType.UUIDV4,
  })
  declare id: string;

  @DeletedAt
  declare deletedAt: Date | undefined;
}

export type SequelizeCreationPreset<T> = Omit<
  T,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
> & { id?: string };
export type SequelizeAttributes<T> = T & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
