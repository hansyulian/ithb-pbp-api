import { Column, ForeignKey, Table, DataType } from "sequelize-typescript";
import {
  BaseModel,
  SequelizeAttributes,
  SequelizeCreationPreset,
} from "~/models/BaseModel";
import { Post } from "~/models/Post";

export type PostCommentAttributes = SequelizeAttributes<{
  content: string;
  postId: string;
  authorName?: string;
}>;

export type PostCommentCreationAttributes =
  SequelizeCreationPreset<PostCommentAttributes>;

@Table({
  paranoid: true,
})
export class PostComment extends BaseModel<
  PostCommentAttributes,
  PostCommentCreationAttributes
> {
  @Column({ type: DataType.TEXT, allowNull: false })
  declare content: string;

  @ForeignKey(() => Post)
  @Column({ type: DataType.UUID, allowNull: false })
  declare postId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare authorName?: string;
}
