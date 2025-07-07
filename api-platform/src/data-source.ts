import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "databaseEemiPay",
  port: 5432,
  username: "api",
  password: "api",
  database: "eemi-pay",
  synchronize: false,
  logging: true,
  entities: ["src/entity/*.ts"],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
