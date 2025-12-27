import chalk from "chalk";
import { config } from "dotenv";

config();

import "module-alias/register";

process.env.TZ = "UTC";

const REQUIRED = [
    "PORT",
    "SESSION_SECRET",
    "POSTGRES_HOST",
    "POSTGRES_PORT",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_DB",
    "REDIS_URI",
    "REDIS_PORT",
];
const OPTIONAL: string[] = [];
let isRequiredMissing = false;

for (const name of REQUIRED) {
    if (!process.env[name]) {
        isRequiredMissing = true;
        console.error(
            chalk.red(`Missing required environment variable: "${name}"`)
        );
    }
}

for (const name of OPTIONAL) {
    if (!process.env[name]) {
        console.warn(
            chalk.yellow(`Missing optional environment variable: "${name}"`)
        );
    }
}

if (isRequiredMissing) {
    process.exit(1);
}
