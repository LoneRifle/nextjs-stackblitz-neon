import { Sequelize, SequelizeOptions } from "sequelize-typescript";

import { User } from "./definitions/User";
import { Post } from "./definitions/Post";
import { Tag } from "./definitions/Tag";
import { PostTagAssociation } from "./definitions/PostTagAssociation";
import { Category } from "./definitions/Category";
import config from "../config";

import { NoticeLoggingClient } from "./clients/NoticeLoggingClient";


const isNeonPasswordless = config.DATABASE_HOST === 'pg.neon.tech'

const sequelizeConfig: SequelizeOptions = {
  host: config.DATABASE_HOST,
  database: config.DATABASE_NAME,
  dialect: "postgres",
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' || isNeonPasswordless,
  },
  username: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,
}
if (isNeonPasswordless) {
  sequelizeConfig.pool = {
    max: 1,
  }
}

const sequelize = new Sequelize(sequelizeConfig);

if (isNeonPasswordless) {
  // @ts-ignore
  sequelize.connectionManager.lib.Client = NoticeLoggingClient
}

sequelize.addModels([User, Category, Post, Tag, PostTagAssociation]);

export { User, Post, Tag, PostTagAssociation, Category };

export const initDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  await User.findOrCreate({
    where: { email: "admin@example.com" },
    defaults: { name: "admin", email: "admin@example.com" },
  });
};
