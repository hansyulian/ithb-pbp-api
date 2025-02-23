import { Column, ForeignKey, Table, DataType } from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";
import { User } from "~/models/User";

export type SessionAttributes = {
  userId: string;
  token: string;
  expiredAt: Date;
};

export type SessionCreationAttributes =
  SequelizeCreationPreset<SessionAttributes>;

@Table({
  paranoid: true,
})
export class Session extends BaseModel<
  SessionAttributes,
  SessionCreationAttributes
> {
  @ForeignKey(() => User)
  @Column({ type: DataType.STRING })
  declare userId: string;

  @Column({ type: DataType.STRING })
  declare token: string;

  @Column({ type: DataType.DATE })
  declare expiredAt: Date;
}
