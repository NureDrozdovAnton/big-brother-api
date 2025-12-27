import "./env";
import chalk from "chalk";
import db from "./data-source";
import * as redis from "./redis-client";
import app from "./app";
import { setupSuperAdmin } from "./setup";
import { Recorder } from "./services";

const connect = async (name: string, fn: () => Promise<unknown>) => {
    try {
        await fn();
    } catch (error) {
        console.error(chalk.red(`${name}: failed to connect`));
        throw error;
    }

    console.log(chalk.green(`${name}: connected`));
};

const start = async () => {
    try {
        await connect("postgres", db.initialize.bind(db));
        await connect("redis", redis.connect);

        setupSuperAdmin();

        app.listen(process.env.PORT || 8086, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error(chalk.red("Failed to start server with reason:"));
        console.error(error);
        process.exit(1);
    }
};

process.on("SIGINT", async () => {
    console.log("Stopping all recordings...");
    Recorder.stopAllRecordings();
    process.exit(0);
});

start();
