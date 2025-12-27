import crypto from "crypto";
import db from "~/data-source";
import { User } from "~/entities";
import type { SignInParams, SignUpParams } from "./interfaces";

const userRepository = db.getRepository(User);

const getPasswordHash = (password: string, salt: string) =>
    new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(
            password,
            salt,
            1000,
            64,
            "sha512",
            (error, derivedKey) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(derivedKey.toString("hex"));
                }
            }
        );
    });

export const signUp = async ({ login, password, name, role }: SignUpParams) => {
    if (!login || !password || !name || !role) {
        throw new Error("Login and password are required");
    }

    const existingUser = await userRepository.findOneBy({ login });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await getPasswordHash(password, salt);

    const user = userRepository.create({
        login,
        name,
        role,
        password: hashedPassword,
        salt,
    });

    await userRepository.save(user);

    return user;
};

export const signIn = async ({ login, password }: SignInParams) => {
    const user = await userRepository.findOneBy({ login });

    if (!user) {
        throw new Error("Login or password is incorrect");
    }

    const hashedPassword = await getPasswordHash(password, user.salt);
    const equal = crypto.timingSafeEqual(
        Buffer.from(hashedPassword),
        Buffer.from(user.password)
    );

    if (!equal) {
        throw new Error("Login or password is incorrect");
    }

    return user;
};
