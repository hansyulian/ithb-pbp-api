import { Column, DataType, Table } from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";

export type EnumAttributes = BaseAttributes & {
  value: string;
  label: string;
  group: string;
};
export type EnumCreationAttributes = CreateOmit<EnumAttributes>;
export type EnumUpdateAttributes = UpdateOmit<Partial<EnumAttributes>>;

export type EnumSequelizeCreationAttributes =
  SequelizeCreationPreset<EnumCreationAttributes>;

@Table({
  paranoid: false,
})
export class Enum extends BaseModel<
  EnumAttributes,
  EnumSequelizeCreationAttributes
> {
  @Column({ type: DataType.STRING })
  declare value: string;

  @Column({ type: DataType.STRING })
  declare group: string;

  @Column({ type: DataType.STRING })
  declare label: string;
}
