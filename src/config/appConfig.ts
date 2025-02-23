import "dotenv/config";
import path from "path";
const pe = process.env;

export const appConfig = {
  env: pe.NODE_ENV || "production",
  app: {
    hashSalt: 10,
    logError: pe.LOG_ERROR === "true",
    fileStoragePath:
      pe.FILE_STORAGE_PATH || path.join(__dirname, "../../", "./storage"),
    resetPasswordTokenAgeSeconds: parseInt(
      pe.RESET_PASSWORD_TOKEN_AGE_SECONDS || "3600"
    ), // 1 hour by default
  },
  api: {
    authCookieKey: pe.API_JWT_COOKIE_KEY || "auth_token",
    exposeApiSummary: pe.API_EXPOSE_API_SUMMARY === "true",
    exposeErrorStack: pe.API_EXPOSE_ERROR_STACK === "true",
    maximumRetrieve: parseInt(pe.API_MAXIMUM_RETRIEVE || "100"),
    port: pe.API_PORT ? parseInt(pe.API_PORT) : 3000,
    url: pe.API_URL || "http://localhost:3000",
  },
  db: {
    username: pe.DB_USERNAME,
    password: pe.DB_PASSWORD,
    database: pe.DB_DATABASE,
    host: pe.DB_HOST,
    port: parseInt(pe.DB_PORT || "5432"),
    dialect: "postgres",
    storage: pe.DB_STORAGE,
    logging: pe.DB_LOGGING,
  },
  jwt: {
    expiry: parseInt(pe.JWT_EXPIRY || `${30 * 24 * 3600}`),
    secret: pe.JWT_SECRET ?? "supersecretjwtkey",
  },
  webApp: {
    url: pe.WEBAPP_URL || "http://localhost:5173",
    resetPasswordPath:
      pe.WEBAPP_RESET_PASSWORD_PATH || "session/reset-password",
  },
  nodemailer: {
    from: pe.NODEMAILER_FROM,
    host: pe.NODEMAILER_HOST || "",
    password: pe.NODEMAILER_PASSWORD || "",
    port: parseInt(pe.NODEMAILER_PORT || "587"),
    username: pe.NODEMAILER_USERNAME,
  },
};
export type AppConfig = typeof appConfig;
