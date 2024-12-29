"use server";

import { auth } from "@/auth";
import { changeName } from "@/lib/db/user";
import { ERROR } from "@/types/error";
import { RES_TYPE } from "@/types/global";

export async function editUser({ name }: { name: string }): Promise<RES_TYPE> {
  const session = await auth();

  if (!session || !session.user) {
    return { status: "error", error: ERROR.INVALID_SESSION };
  }

  const id = session.user.id;
  const updatedUser = await changeName({ id, name });

  if (updatedUser.status === "error") {
    return updatedUser;
  }

  return {
    status: "success",
    data: updatedUser
  };
}
