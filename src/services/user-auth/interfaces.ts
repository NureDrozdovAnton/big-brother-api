import type { UserRole } from "~/entities/user";

export interface SignUpParams {
    login: string;
    password: string;
    name: string;
    role: UserRole;
}

export interface SignInParams {
    login: string;
    password: string;
}
