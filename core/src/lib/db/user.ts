import { AuthMode, EMAIL_USER, GOOGLE_USER } from "@/types/auth";
import db from "../db";
import { ERROR } from "@/types/error";
import { Prisma } from "@prisma/client";
import { RES_TYPE } from "@/types/global";
import { hashPassword } from "@/utils/hash";

export async function findUser({
  email,
  mode,
}: {
  email?: string;
  mode: AuthMode;
}): Promise<RES_TYPE> {
  const user = await db.user.findFirst({
    where: {
      OR: [{ email }],
    },
  });

  if (!user && mode === AuthMode.EMAIL) {
    return {
      status: "error",
      error: ERROR.USER_NOT_FOUND,
    };
  }

  if (user) {
    if (mode === AuthMode.GOOGLE && user.loginType === AuthMode.EMAIL) {
      return {
        status: "error",
        error: ERROR.USER_EXISTS_BUT_WITH_EMAIL_LOGIN,
      };
    } else if (mode === AuthMode.EMAIL && user.loginType === AuthMode.GOOGLE) {
      return {
        status: "error",
        error: ERROR.USER_EXISTS_BUT_WITH_GOOGLE_LOGIN,
      };
    }
  }

  return {
    status: "success",
    data: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password!,
          image: user.image ?? undefined,
          isVerified: user.isVerified,
        }
      : null,
  };
}

export async function createUser({
  type,
  user,
}:
  | {
      user: GOOGLE_USER;
      type: AuthMode.GOOGLE;
    }
  | {
      user: EMAIL_USER;
      type: AuthMode.EMAIL;
    }): Promise<RES_TYPE> {
  try {
    let password: string | undefined = undefined;

    if (type === AuthMode.EMAIL) {
      password = await hashPassword(user.password);
    }

    const newUser = await db.user.create({
      data: {
        name: user.name,
        email: user.email,
        image:
          type === AuthMode.GOOGLE ? (user as GOOGLE_USER).image : undefined,
        isVerified: type === AuthMode.GOOGLE,
        loginType: type,
        password,
      },
    });

    return {
      status: "success",
      data: newUser,
    };
  } catch (error) {
    console.error("User creation error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const field = error.meta?.target as string[];
        if (field?.includes("email")) {
          return { status: "error", error: ERROR.EMAIL_EXISTS };
        }
      } else if (error.code === "P2011") {
        return { status: "error", error: ERROR.INVALID_LOGIN };
      }
    }

    return { status: "error", error: ERROR.DB_ERROR };
  }
}

export async function isUserVerified(email: string): Promise<boolean> {
  try {
    const dbUser = await db.user.findFirst({
      where: {
        email,
      },
    });

    return dbUser?.isVerified ?? false;
  } catch (error) {
    console.error("isUserVerified error:", error);
    return false;
  }
}
