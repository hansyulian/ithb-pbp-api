import { createNamespace } from "cls-hooked";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { appConfig } from "~/config";
import { Enum } from "~/models/Enum";
import { Post } from "~/models/Post";
import { PostComment } from "~/models/PostComment";
import { Session } from "~/models/Session";
import { User } from "~/models/User";

const clsNamespace = createNamespace("transaction-namespace");

Sequelize.useCLS(clsNamespace);

export type DBConfig = {
  user: string;
  password: string;
  database: string;
  host: string;
  port: number;
  storage?: string;
  logging?: "console";
};

export function setupDatabase(
  dbConfig = appConfig.db,
  sequelizeOptions: Partial<SequelizeOptions> = {}
) {
  const logging = dbConfig.logging === "console" ? console.log : () => {};
  const sequelizeConfig: SequelizeOptions = {
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: "postgres",
    storage: dbConfig.storage,
    logging,
    models: [User, Session, Enum, Post, PostComment],
    ...sequelizeOptions,
  };
  const sequelize = new Sequelize(sequelizeConfig);
  return sequelize;
}
