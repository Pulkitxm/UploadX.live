/* eslint-disable no-unused-vars */

import { z } from "zod";
import { ERROR } from "./error";

export enum AuthMode {
  GOOGLE = "GOOGLE",
  EMAIL = "EMAIL",
}

export const baseUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
});

export const userSchema = z.object({
  ...baseUserSchema.shape,
  username: z.string(),
  password: z.string(),
});

export const googleUserSchema = z.object({
  ...baseUserSchema.shape,
});

export type EMAIL_USER = z.infer<typeof userSchema>;
export type GOOGLE_USER = z.infer<typeof googleUserSchema>;
export type USER = EMAIL_USER | GOOGLE_USER;
export type BASE_USER = z.infer<typeof baseUserSchema>;

export type AuthSuccess = {
  status: "success";
};

export type AuthError = {
  status: "error";
  error: ERROR;
};

export type AuthResponse = AuthSuccess | AuthError;
