import NextAuth from "next-auth";

import { Auth } from "@/lib/auth";
import { authConfig } from "@/lib/auth/auth-config";
import { getToken } from "@/lib/config";
import { NEXT_PUBLIC_ASSETS_SERVR_BASE_URL, SECRET } from "@/lib/constants";
import { getUserSessionData } from "@/prisma/db/user";
import { AuthMode, userLoginSchema } from "@/types/auth";
import { ERROR } from "@/types/error";

export const { handlers, signIn, auth, signOut } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async signIn({ account, user }) {
      const validatedUser = userLoginSchema.safeParse(user);

      if (!validatedUser.success) {
        return "/login?error=" + ERROR.INVALID_LOGIN;
      }

      if (account?.provider === "google" || account?.provider === "credentials") {
        const mode = account.provider === "google" ? AuthMode.GOOGLE : AuthMode.EMAIL;
        let newUser: Auth;

        if (mode === AuthMode.GOOGLE) {
          newUser = new Auth({
            mode: AuthMode.GOOGLE,
            user: {
              name: validatedUser.data.name,
              email: validatedUser.data.email
            },
            imageUrl: user.image!
          });
        } else {
          newUser = new Auth({
            mode: AuthMode.EMAIL,
            user: {
              name: validatedUser.data.name,
              email: validatedUser.data.email
            }
          });
        }

        try {
          const res = await newUser.signIn();
          if (res.status === "success") {
            user.isVerified = res.data?.isVerified; // ← Add this line
            return true;
          } else {
            return "/login?error=" + res.error;
          }
        } catch (error) {
          console.log("error: ", error);
          if (error) {
            return "/login?error=" + ERROR.UNEXPECTED;
          }
        }
      }
      return "/login?error=" + ERROR.UNEXPECTED;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id!;
        token.email = user.email;
        token.name = user.name;
        token.isVerified = user.isVerified || false;
        token.loginType = account?.provider === "google" ? AuthMode.GOOGLE : AuthMode.EMAIL;
      }
      return token;
    },

    async session({ session, token, trigger }) {
      try {
        const { id, isVerified, loginType, name } = await getUserSessionData(token.email!);

        if (!id) {
          throw new Error(ERROR.USER_NOT_FOUND);
        }
        if (!isVerified) {
          session.user.isVerified = false;
        }
        if (!loginType) {
          throw new Error(ERROR.INVALID_LOGIN);
        }

        const img_token = getToken(id, SECRET);
        if (!img_token) {
          throw new Error(ERROR.UNAUTHORIZED);
        }

        const newSession = {
          ...session,
          user: {
            ...session.user,
            id,
            isVerified: isVerified || false,
            loginType,
            email: token.email,
            name,
            image: NEXT_PUBLIC_ASSETS_SERVR_BASE_URL + "/pfp/" + id + "?t=" + new Date().getTime(),
            img_token
          }
        };

        if (trigger === "update" && session) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return newSession;
        }

        return newSession;
      } catch (error) {
        console.error("Session error:", error);
        return {
          ...session,
          user: {
            ...session.user,
            isVerified: false
          }
        };
      }
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  }
});
