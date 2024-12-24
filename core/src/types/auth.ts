/* eslint-disable no-unused-vars */

import { z } from "zod";

export enum AuthMode {
  GOOGLE = "GOOGLE",
  EMAIL = "EMAIL",
}

export const userLoginSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  image: z.string().optional(),
});

export const baseUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
  isVerified: z.boolean().optional(),
});

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
  isVerified: z.boolean().optional(),
  password: z.string(),
  loginType: z.nativeEnum(AuthMode).optional(),
});

export const googleUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
  isVerified: z.boolean().optional(),
});

export type EMAIL_USER = z.infer<typeof userSchema>;
export type GOOGLE_USER = z.infer<typeof googleUserSchema>;
export type USER = EMAIL_USER | GOOGLE_USER;
export type BASE_USER = z.infer<typeof baseUserSchema>;
