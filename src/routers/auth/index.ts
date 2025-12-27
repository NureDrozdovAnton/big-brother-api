import type { BaseResponse } from "~/interfaces";
import type { SignInRequest } from "./interfaces";
import { Router } from "express";
import { validate } from "~/middlewares";
import { Logger, UserAuth } from "~/services";
import { signInSchema } from "./schema";
import { EventType } from "~/entities/log";

const router = Router();

router.post(
    "/sign-in",
    validate(signInSchema),
    async (req: SignInRequest, res: BaseResponse) => {
        try {
            const user = await UserAuth.signIn({
                login: req.body.login,
                password: req.body.password,
            });

            req.session.userId = user.id;

            Logger.logAction(user, EventType.Login);

            res.json({
                ok: true,
                data: null,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Unknown error";

            res.status(401).json({
                ok: false,
                error: message,
            });
        }
    }
);

router.post("/sign-out", async (req, res: BaseResponse) => {
    if (res.locals.user) {
        Logger.logAction(res.locals.user, EventType.Logout);
    }

    req.session.destroy((error) => {
        if (error) {
            console.log(error);

            res.json({
                ok: false,
                error: "Unknown error",
            });
        } else {
            res.json({
                ok: true,
                data: null,
            });
        }
    });
});

export default router;
