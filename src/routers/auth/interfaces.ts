import type { Request } from "express";

interface SignInRequestData {
    login: string;
    password: string;
}

export type SignInRequest = Request<unknown, unknown, SignInRequestData>;
