import { AuthMode } from "@/auth";

import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isVerified: boolean;
      loginType: AuthMode;
      img_token: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    isVerified: boolean;
    loginType: AuthMode;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    isVerified: boolean;
    loginType: AuthMode;
    picture?: string;
  }
}
