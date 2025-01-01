/* eslint-disable no-unused-vars */

import { z } from "zod";

export enum AuthMode {
  GOOGLE = "GOOGLE",
  EMAIL = "EMAIL",
  EMAIL_GOOGLE = "EMAIL_GOOGLE"
}

export const userLoginSchema = z.object({
  email: z.string().email(),
  name: z.string()
});

export const baseUserSchema = z.object({
  username: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  isVerified: z.boolean().optional()
});

export const userSchema = baseUserSchema.extend({
  id: z.string().optional(),
  password: z.string(),
  loginType: z.nativeEnum(AuthMode).optional()
});

export const googleUserSchema = baseUserSchema;

export type EMAIL_USER = z.infer<typeof userSchema>;
export type GOOGLE_USER = z.infer<typeof googleUserSchema>;
export type USER = EMAIL_USER | GOOGLE_USER;
export type BASE_USER = z.infer<typeof baseUserSchema>;
