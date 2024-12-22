import NextAuth from "next-auth";
import { authConfig } from "./lib/auth/config";
import { AuthMode } from "./types/auth";
import { Auth } from "./lib/auth";
import { ERROR } from "./types/error";

export const { handlers, signIn, auth, signOut } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google" || account?.provider === "email") {
        const mode =
          account.provider === "google" ? AuthMode.GOOGLE : AuthMode.EMAIL;
        const newUser = new Auth(
          {
            name: user.name!,
            email: user.email!,
            image: user.image!,
          },
          mode,
        );
        try {
          const res = await newUser.signIn();
          if (res.status === "success") {
            return true;
          } else {
            console.log(res.error);
            return "/login?error=" + res.error;
          }
        } catch (error) {
          if (error) {
            return "/login?error=" + ERROR.UNEXPECTED;
          }
        }
      }
      return false;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.loginType =
          account?.provider === "google" ? AuthMode.GOOGLE : AuthMode.EMAIL;
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          loginType: token.loginType as AuthMode,
        },
      };
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
