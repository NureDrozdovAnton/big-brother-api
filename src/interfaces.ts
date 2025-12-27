import type { Response } from "express";
import type { User } from "./entities";

//
// Core types for the application
//
// Describes the shape of the response body
//

export interface BaseErrorBodyResponse {
    ok: false;
    error: string;
}

export interface BaseSuccessBodyResponse<T> {
    ok: true;
    data: T;
}

export type BaseBodyResponse<T> =
    | BaseErrorBodyResponse
    | BaseSuccessBodyResponse<T>;

export interface ResponseLocals {
    user?: User;
}

export type BaseResponse<T = unknown> = Response<
    BaseBodyResponse<T>,
    ResponseLocals
>;
