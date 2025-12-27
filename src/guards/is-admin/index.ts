import type { NextFunction, Request } from "express";
import { UserRole } from "~/entities/user";
import type { BaseResponse } from "~/interfaces";

const isAdmin = (_: Request, res: BaseResponse, next: NextFunction) => {
    if (!res.locals.user) {
        res.status(401).json({
            ok: false,
            error: "Unauthenticated",
        });
    } else if (res.locals.user.role !== UserRole.Admin) {
        res.status(403).json({
            ok: false,
            error: "Forbidden",
        });
    } else {
        next();
    }
};

export default isAdmin;
