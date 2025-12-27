import { UserRole } from "~/entities/user";
import type { BaseResponse } from "~/interfaces";

interface MeResponseDataAuthenticated {
    auth: true;
    id: string;
    name: string;
    role: UserRole;
    login: string;
}

interface MeResponseDataUnauthenticated {
    auth: false;
}

type MeResponseData =
    | MeResponseDataAuthenticated
    | MeResponseDataUnauthenticated;

export type MeResponse = BaseResponse<MeResponseData>;
