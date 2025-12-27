import type { MeResponse } from "./interfaces";
import { Router } from "express";
import db from "~/data-source";
import User from "~/entities/user/user";

const router = Router();

router.get("/", async (_, res: MeResponse) => {
    if (!res.locals.user) {
        return res.json({
            ok: true,
            data: {
                auth: false,
            },
        });
    }

    try {
        const userRepo = db.getRepository(User);

        const user = await userRepo.findOne({
            where: { id: res.locals.user.id },
        });

        if (!user) {
            return res.status(404).json({
                ok: false,
                error: "NOT_FOUND",
            });
        }

        res.json({
            ok: true,
            data: {
                auth: true,
                id: user.id,
                name: user.name,
                login: user.login,
                role: user.role,
            },
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Unknown error";

        res.status(500).json({
            ok: false,
            error: message,
        });
    }
});

export default router;
