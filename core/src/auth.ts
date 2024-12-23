import NextAuth from "next-auth";
import { authConfig } from "./lib/auth/config";
import { AuthMode, userLoginSchema } from "./types/auth";
import { Auth } from "./lib/auth";
import { ERROR } from "./types/error";
import { isUserVerified } from "./lib/db/user";

export const { handlers, signIn, auth, signOut } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ account, user }) {
      const validatedUser = userLoginSchema.safeParse(user);

      if (!validatedUser.success) {
        return "/login?error=" + ERROR.INVALID_LOGIN;
      }

      if (
        account?.provider === "google" ||
        account?.provider === "credentials"
      ) {
        const mode =
          account.provider === "google" ? AuthMode.GOOGLE : AuthMode.EMAIL;
        const newUser = new Auth(
          {
            name: validatedUser.data.name,
            email: validatedUser.data.email,
            image: validatedUser.data.image,
          },
          mode,
        );
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
        token.picture = user.image!;
        token.isVerified = user.isVerified || false; // Add isVerified status
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
          id: token.id,
          email: token.email,
          name: token.name,
          image: token.picture,
          isVerified: await isUserVerified(token.email!),
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
