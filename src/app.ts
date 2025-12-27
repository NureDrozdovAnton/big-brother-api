import RedisStore from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import { AuthMiddleware } from "./middlewares";
import { MeRouter, AuthRouter, OperatorRouter, AdminRouter } from "./routers";
import * as redis from "./redis-client";

const app = express();

app.use(morgan("common"));
app.use(express.json());
app.use(
    cors({
        origin: ["http://10.0.2.2:3000", "http://10.0.2.2:5173"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: new RedisStore({ client: redis.client, prefix: "session:" }),
        cookie: {
            httpOnly: true,
        },
        resave: false,
        saveUninitialized: true,
    })
);

// Top Level Middleware
//
app.use(AuthMiddleware);

// Top Level Routers
//
app.use("/me", MeRouter);
app.use("/auth", AuthRouter);
app.use("/operator", OperatorRouter);
app.use("/admin", AdminRouter);

export default app;
