import dotenv from "dotenv";
dotenv.config();

export const SECRET = process.env.AUTH_SECRET ?? "";
export const BLOB_CDN_URL = process.env.BLOB_CDN_URL ?? "";
export const BLOB_CONTAINER_IMAGES_PATH = process.env.BLOB_CONTAINER_IMAGES_PATH ?? "";
export const SERVER_NAME = process.env.SERVER_NAME ?? "";
export const PORT = process.env.PORT ?? 3000;