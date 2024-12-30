import {
  AuthMode,
  EMAIL_USER,
  GOOGLE_USER,
  googleUserSchema,
  USER,
  userSchema
} from "@/types/auth";
import { createUser, findUser } from "@/lib/db/user";
import { ERROR } from "@/types/error";
import { RES_TYPE } from "@/types/global";
import { uploadProfilePic_FileOrUrl } from "@/actions/upload";
import { sendVerificationEmail } from "@/actions/sendEmail";

export class Auth {
  user: USER;
  mode: AuthMode;
  imageUrl?: string;

  constructor(
    props: (
      | {
          mode: AuthMode.GOOGLE;
          imageUrl: string;
        }
      | {
          mode: AuthMode.EMAIL;
        }
    ) & {
      user: GOOGLE_USER | EMAIL_USER;
    }
  ) {
    this.mode = props.mode;
    if (props.mode === AuthMode.GOOGLE) {
      this.user = {
        name: props.user.name,
        email: props.user.email
      };

      const url = props.imageUrl;
      this.imageUrl = url.split("=")[0];
    } else {
      this.user = {
        name: props.user.name,
        email: props.user.email
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

  async uploadGoogleImage() {
    if (this.mode === AuthMode.GOOGLE && this.imageUrl) {
      return await uploadProfilePic_FileOrUrl(this.imageUrl);
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
          type: AuthMode.GOOGLE
        });

        if (newDbUser.status === "success") {
          const res = await this.uploadGoogleImage();

          if (res?.status === "error") {
            return { status: "error", error: res.error };
          }

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

  async sendEmail(): Promise<RES_TYPE> {
    if (this.mode === AuthMode.EMAIL) {
      return await sendVerificationEmail({
        email: this.user.email
      });
    } else {
      return { status: "error", error: ERROR.INVALID_AUTH_MODE };
    }
  }
}
