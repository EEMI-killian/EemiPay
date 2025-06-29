import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "api",
    password: "api",
    database: "eemi-pay",
    synchronize: false,
    logging: false,
    entities: [
        "src/entity/*.ts",
        "src/entity/*.js"
        ],
    migrations: [
        "src/migration/*.ts",
         "src/migration/*.js"
    ],
    subscribers: [],
})
