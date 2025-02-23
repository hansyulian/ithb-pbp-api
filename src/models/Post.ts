import { Column, Table, DataType } from "sequelize-typescript";
import {
  BaseModel,
  SequelizeAttributes,
  SequelizeCreationPreset,
} from "~/models/BaseModel";

export type PostAttributes = SequelizeAttributes<{
  title: string;
  content: string;
  authorName?: string;
}>;

export type PostCreationAttributes = SequelizeCreationPreset<PostAttributes>;

@Table({
  paranoid: true,
})
export class Post extends BaseModel<PostAttributes, PostCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare content: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare authorName?: string;
}
