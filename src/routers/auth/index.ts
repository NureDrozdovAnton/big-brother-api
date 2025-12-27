import type { BaseResponse } from "~/interfaces";
import type { SignInRequest } from "./interfaces";
import { Router } from "express";
import { validate } from "~/middlewares";
import { UserAuth } from "~/services";
import { signInSchema } from "./schema";

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

router.post("/sign-out", async (req, res) => {
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
