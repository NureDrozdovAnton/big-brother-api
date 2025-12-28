declare global {
    namespace NodeJS {
        interface ProcessEnv {
            //
            // When adding new variables, make sure mandatory variables (not-null not-undefined strings)
            // are added to corresponding array in src/env.ts
            //
            PORT: string;
            POSTGRES_HOST: string;
            POSTGRES_PORT: string;
            POSTGRES_USER: string;
            POSTGRES_PASSWORD: string;
            POSTGRES_DB: string;
            REDIS_URI: string;
            REDIS_PORT: string;
            SESSION_SECRET: string;
            SUPER_ADMIN_LOGIN?: string;
            SUPER_ADMIN_PASSWORD?: string;
            MEDIA_MTX_URL: string;
            WEBRTC_BASE_URL: string;
            EMULATOR_BASE_URL: string;
        }
    }
}

export {};
