// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    ACCESS_TOKEN_EXPIRES: string;
    REFRESH_TOKEN_EXPIRES: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
