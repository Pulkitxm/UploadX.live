import {
  AuthMode,
  EMAIL_USER,
  GOOGLE_USER,
  googleUserSchema,
  USER,
  userSchema,
} from "@/types/auth";
import { createUser, findUser } from "../db/user";
import { ERROR } from "@/types/error";
import { RES_TYPE } from "@/types/global";

export class Auth {
  user: USER;
  mode: AuthMode;

  constructor(user: GOOGLE_USER | EMAIL_USER, mode: AuthMode) {
    this.mode = mode;
    if (mode === AuthMode.GOOGLE) {
      this.user = {
        name: user.name,
        email: user.email,
        image: user.image,
      };
    } else {
      this.user = {
        name: user.name,
        email: user.email,
        image: user.image,
      };
    }
  }

  validateUser(): USER | null {
    if (this.mode === AuthMode.GOOGLE) {
      const validatedUser = googleUserSchema.safeParse(this.user);
      if (validatedUser.success) {
        return validatedUser.data;
      } else return null;
    } else {
      const validatedUser = userSchema.safeParse(this.user);
      if (validatedUser.success) {
        return validatedUser.data;
      } else return null;
    }
  }

  async signIn(): Promise<RES_TYPE> {
    const dbUser = await findUser({ email: this.user.email, mode: this.mode });

    if (dbUser.status === "error") {
      return { status: "error", error: dbUser.error };
    }

    if (this.mode === AuthMode.GOOGLE) {
      if (!dbUser.data) {
        const newDbUser = await createUser({
          user: this.user,
          type: AuthMode.GOOGLE,
        });
        if (newDbUser.status === "success") {
          return { status: "success" };
        }
        return { status: "error", error: newDbUser.error };
      } else {
        return { status: "success" };
      }
    } else {
      if (!dbUser.data) {
        return { status: "error", error: ERROR.USER_NOT_FOUND };
      } else {
        return { status: "success" };
      }
    }
  }
}
