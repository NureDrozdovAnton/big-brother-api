import { UserRole } from "./entities/user";
import { UserAuth } from "./services";

const SUPER_ADMIN_LOGIN = process.env.SUPER_ADMIN_LOGIN;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

export const setupSuperAdmin = async () => {
    if (!SUPER_ADMIN_LOGIN || !SUPER_ADMIN_PASSWORD) {
        console.warn(
            "SUPER_ADMIN_LOGIN or SUPER_ADMIN_PASSWORD env variables aren't set. Skipping super admin setup."
        );
        return;
    }

    try {
        await UserAuth.signUp({
            login: SUPER_ADMIN_LOGIN,
            password: SUPER_ADMIN_PASSWORD,
            role: UserRole.Admin,
            name: "Super Admin",
        });
    } catch (error) {}
};
