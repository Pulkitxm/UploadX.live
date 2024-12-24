import NextAuth from "next-auth";
import { authConfig } from "./lib/auth/config";
import { AuthMode, userLoginSchema } from "./types/auth";
import { Auth } from "./lib/auth";
import { ERROR } from "./types/error";
import { isUserVerified } from "./lib/db/user";
import { getUserImageUrl } from "./utils/user";

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
        let newUser: Auth;

        if (mode === AuthMode.GOOGLE) {
          newUser = new Auth({
            mode: AuthMode.GOOGLE,
            user: {
              name: validatedUser.data.name,
              email: validatedUser.data.email,
            },
            imageUrl: user.image!,
          });
        } else {
          newUser = new Auth({
            mode: AuthMode.EMAIL,
            user: {
              name: validatedUser.data.name,
              email: validatedUser.data.email,
            },
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
        token.isVerified = user.isVerified || false; // Add isVerified status
        token.loginType =
          account?.provider === "google" ? AuthMode.GOOGLE : AuthMode.EMAIL;
      }
      return token;
    },

    async session({ session, token }) {
      const { id, isVerified } = await isUserVerified(token.email!);
      return {
        ...session,
        user: {
          ...session.user,
          id: id!,
          email: token.email,
          name: token.name,
          image: getUserImageUrl(id!),
          isVerified,
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
