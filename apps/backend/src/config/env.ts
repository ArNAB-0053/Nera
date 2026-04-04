import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || "",
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || "",
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || "",
  JWT_SECRET: process.env.JWT_SECRET || "my-secret-jwt",
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_URL: process.env.APP_URL!,
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET!,
};