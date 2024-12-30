"use server";

import { createUser, findUser } from "@/prisma/db/user";
import { AuthMode } from "@/types/auth";
import { ERROR } from "@/types/error";
import { RES_TYPE } from "@/types/global";

export async function signUp({
  email,
  name,
  password
}: {
  name: string;
  password: string;
  email: string;
}): Promise<RES_TYPE> {
  try {
    const existingUser = await findUser({ mode: AuthMode.EMAIL, email });
    if (existingUser.status === "success") {
      return { status: "error", error: ERROR.EMAIL_EXISTS };
    }

    const newUser = await createUser({
      type: AuthMode.EMAIL,
      user: { email, name, password }
    });

    if (newUser.status === "error") {
      return { status: "error", error: newUser.error };
    }

    return { status: "success" };
  } catch (error) {
    console.log(error);

    return { status: "error", error: ERROR.UNEXPECTED };
  }
}
