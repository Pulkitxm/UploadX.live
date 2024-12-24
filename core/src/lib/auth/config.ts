import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../constants";
import { ERROR } from "@/types/error";
import { findUser } from "../db/user";
import { AuthMode, userSchema } from "@/types/auth";
import { z } from "zod";
import { comparePassword } from "@/utils/hash";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(cred) {
        const crdSchema = z.object({
          email: z.string().email(),
          password: z.string(),
        });

        const res = crdSchema.safeParse(cred);

        if (!res.success) {
          throw new Error(ERROR.INVALID_CREDENTIALS);
        }

        const credentials = res.data;

        if (!credentials?.email || !credentials?.password) {
          throw new Error(ERROR.INVALID_CREDENTIALS);
        }

        const dbUser = await findUser({
          mode: AuthMode.EMAIL,
          email: credentials.email as string,
        });

        if (dbUser.status === "error") {
          throw new Error(ERROR.USER_NOT_FOUND);
        }

        const validatedUser = userSchema.safeParse(dbUser.data);

        if (!validatedUser.success) {
          throw new Error(ERROR.USER_NOT_FOUND);
        }

        const user = validatedUser.data;
        if (!user) {
          throw new Error(ERROR.INVALID_CREDENTIALS);
        }

        if(user.loginType && user.loginType !== AuthMode.EMAIL) {
          throw new Error(ERROR.USER_EXISTS_BUT_WITH_GOOGLE_LOGIN);
        }

        const isValid = await comparePassword(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          throw new Error(ERROR.INVALID_CREDENTIALS);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          isVerified: user.isVerified ?? false,
          loginType: AuthMode.EMAIL,
        };
      },
    }),
  ],
};
