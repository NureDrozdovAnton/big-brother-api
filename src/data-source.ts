import path from "path";
import { DataSource } from "typeorm";
import * as entities from "./entities";

const host = process.env.POSTGRES_HOST;
const port = +(process.env.POSTGRES_PORT || 5432);
const username = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const database = process.env.POSTGRES_DB;

const db = new DataSource({
    type: "postgres",
    host,
    port,
    username,
    password,
    database,
    entities: [...Object.values(entities)],
    migrations: [path.resolve(__dirname, "migrations/*")],
    synchronize: false,
    migrationsRun: true,
});

export default db;
