import type { NextFunction, Request } from "express";
import type { BaseResponse } from "~/interfaces";

const isAuthenticated = (_: Request, res: BaseResponse, next: NextFunction) => {
    if (!res.locals.user) {
        res.status(401).json({
            ok: false,
            error: "Unauthenticated",
        });
    } else {
        next();
    }
};

export default isAuthenticated;
