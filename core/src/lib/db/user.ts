import { AuthMode, EMAIL_USER, GOOGLE_USER, USER } from "@/types/auth";
import db from "../db";
import { ERROR } from "@/types/error";
import { Prisma } from "@prisma/client";

export async function findUser({
  email,
  username,
}: {
  email?: string;
  username?: string;
}): Promise<USER | null> {
  const user = await db.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (!user) {
    return null;
  }

  return {
    name: user.name,
    email: user.email,
    username: user.username,
    password: user.password!,
    image: user.image ?? undefined,
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
    }): Promise<
  | {
      status: "success";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?: any;
    }
  | {
      status: "error";
      error: ERROR;
    }
> {
  try {
    const username =
      type === AuthMode.EMAIL
        ? user.username
        : user.name + Math.floor(Math.random() * 1000);

    const newUser = await db.user.create({
      data: {
        username,
        name: user.name,
        email: user.email,
        image: AuthMode.GOOGLE ? user.image : undefined,
        isVerified: type === AuthMode.GOOGLE ? true : false,
        loginType: AuthMode[type],
        password: type === AuthMode.EMAIL ? user.password : undefined,
      },
    });

    return {
      status: "success",
      data: newUser,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const field = error.meta?.target as string[];
        if (field.includes("email")) {
          return { status: "error", error: ERROR.EMAIL_EXISTS };
        }
        if (field.includes("username")) {
          return { status: "error", error: ERROR.USERNAME_EXISTS };
        }
      }
    }
    console.error("User creation error:", error);
    return { status: "error", error: ERROR.DB_ERROR };
  }
}
