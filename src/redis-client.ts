import { createClient } from "redis";

const uri = process.env.REDIS_URI || "redis://localhost:6379";

export const client = createClient({ url: uri });

export const connect = () =>
    new Promise<void>((resolve, reject) => {
        client.on("connect", resolve);
        client.on("error", reject);
        client.connect();
    });

export const disconnect = () =>
    new Promise<void>((resolve, reject) => {
        client.on("end", resolve);
        client.on("error", reject);
        client.disconnect();
    });
