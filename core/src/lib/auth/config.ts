import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../constants";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
};
