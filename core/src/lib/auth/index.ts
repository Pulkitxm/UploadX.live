import {
  AuthMode,
  AuthResponse,
  googleUserSchema,
  USER,
  userSchema,
} from "@/types/auth";
import { createUser, findUser } from "../db/user";
import { ERROR } from "@/types/error";

export class Auth {
  user: USER;
  mode: AuthMode;

  constructor(user: USER, mode: AuthMode) {
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

  async signIn(): Promise<AuthResponse> {
    if (this.mode === AuthMode.GOOGLE) {
      const dbUser = await findUser({ email: this.user.email });
      if (!dbUser) {
        const newDbUser = await createUser({
          user: this.user,
          type: AuthMode.GOOGLE,
        });

        if (newDbUser.status === "success") {
          return { status: "success" };
        }
        return { status: "error", error: newDbUser.error };
      }
      return { status: "success" };
    }
    return { status: "error", error: ERROR.INVALID_AUTH_MODE };
  }
}
