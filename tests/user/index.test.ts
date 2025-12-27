import request from "supertest";
import app from "../../src/app";
import db from "../../src/data-source";
import * as redis from "../../src/redis-client";

beforeAll(async () => {
    await db.initialize();
    await redis.connect();
});

afterAll(async () => {
    await db.destroy();
    await redis.disconnect();
});

describe("User operations", () => {
    const USER_EMAIL = "user@gmail.com";
    const USER_PASSWORD = "12345";
    const agent = request.agent(app);

    test("GET /me for non-authenticated user", async () => {
        const response = await agent.get("/me");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ok: true, data: { auth: false } });
    });

    test("POST /auth/sign-up", async () => {
        const response = await agent
            .post("/auth/sign-up")
            .send({ email: USER_EMAIL, password: USER_PASSWORD })
            .set("Accept", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ok: true, data: null });
    });

    test("GET /me for signed-up user", async () => {
        const response = await agent.get("/me");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ok: true,
            data: { auth: true, email: USER_EMAIL },
        });
    });

    test("POST /auth/sign-out", async () => {
        const response = await agent.post("/auth/sign-out");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ok: true, data: null });
    });

    test("GET /me for signed-out user", async () => {
        const response = await agent.get("/me");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ok: true, data: { auth: false } });
    });

    test("POST /auth/sign-in", async () => {
        const response = await agent
            .post("/auth/sign-in")
            .send({ email: USER_EMAIL, password: USER_PASSWORD });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ok: true, data: null });
    });

    test("GET /me for signed-in user", async () => {
        const response = await agent.get("/me");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ok: true,
            data: { auth: true, email: USER_EMAIL },
        });
    });

    test("POST /auth/sign-out", async () => {
        const response = await agent.post("/auth/sign-out");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ok: true, data: null });
    });

    test("POST /auth/sign-in with wrong password", async () => {
        const response = await agent
            .post("/auth/sign-in")
            .send({ email: USER_EMAIL, password: "wrong-password" });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            ok: false,
            error: "Email or password is incorrect",
        });
    });

    test("POST /auth/sign-in with wrong email", async () => {
        const response = await agent
            .post("/auth/sign-in")
            .send({ email: "wrong-email@gmail.com", password: USER_PASSWORD });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            ok: false,
            error: "Email or password is incorrect",
        });
    });

    test("POST /auth/sign-up with invalid email", async () => {
        const response = await agent
            .post("/auth/sign-up")
            .send({ email: "invalid email", password: USER_PASSWORD });

        expect(response.status).toBe(400);
        expect(response.body.ok).toBe(false);
        expect(typeof response.body.error).toBe("string");
    });

    test("POST /auth/sign-up with existing email", async () => {
        const response = await agent
            .post("/auth/sign-up")
            .send({ email: USER_EMAIL, password: USER_PASSWORD });

        expect(response.status).toBe(409);
        expect(response.body).toEqual({
            ok: false,
            error: "User already exists",
        });
    });
});
