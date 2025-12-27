import db from "~/data-source";
import { Log, User } from "~/entities";
import { EventType } from "~/entities/log";
import { LogParams } from "./interfaces";

const logRepo = db.getRepository(Log);

export const logAction = (
    user: User,
    type: EventType,
    meta: Record<string, unknown> = {}
) => {
    const logEntry = logRepo.create({
        user,
        eventType: type,
        meta,
    });

    return logRepo.save(logEntry);
};

export const getLogs = async ({ by, types, startDate, endDate }: LogParams) => {
    const query = logRepo
        .createQueryBuilder("log")
        .leftJoinAndSelect("log.user", "user");

    if (by) {
        query.andWhere("log.userId = :userId", { userId: by });
    }

    if (types && types.length > 0) {
        query.andWhere("log.eventType IN (:...types)", { types });
    }

    if (startDate) {
        query.andWhere("log.createdAt >= :startDate", { startDate });
    }

    if (endDate) {
        query.andWhere("log.createdAt <= :endDate", { endDate });
    }

    query.orderBy("log.createdAt", "DESC");

    return query.getMany();
};
