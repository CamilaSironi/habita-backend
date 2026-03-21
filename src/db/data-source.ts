import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import { env } from "../config/env";
import { FavoritesEntity } from "./entities/FavoritesEntity";
import { InquiryEntity } from "./entities/InquiryEntity";
import { PropertyEntity } from "./entities/PropertyEntity";
import { PropertyImageEntity } from "./entities/PropertyImageEntity";
import { UserEntity } from "./entities/UserEntity";

export const appDataSource = new DataSource({
  type: "postgres",
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  entities: [PropertyEntity, PropertyImageEntity, InquiryEntity, FavoritesEntity, UserEntity],
  migrations: [path.join(__dirname, "migrations", "*.{ts,js}")],
  synchronize: false,
  logging: false
});
