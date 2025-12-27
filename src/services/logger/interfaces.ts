import { EventType } from "~/entities/log";

export interface LogParams {
    by?: string;
    types?: EventType[];
    startDate?: Date;
    endDate?: Date;
}
