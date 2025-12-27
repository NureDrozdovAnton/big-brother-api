import type { NextFunction, Request } from "express";
import type { BaseResponse } from "~/interfaces";
import db from "~/data-source";
import { User } from "~/entities";

const userRepo = db.getRepository(User);

const auth = async (req: Request, res: BaseResponse, next: NextFunction) => {
    if (!req.session.userId) {
        return next();
    }

    const user = await userRepo.findOne({
        where: { id: req.session.userId },
    });

    if (!user) {
        return req.session.destroy(() => next());
    }

    res.locals.user = user;
    next();
};

export default auth;
