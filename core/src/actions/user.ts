"use server";

import { changeName } from "@/lib/db/user";
import { RES_TYPE } from "@/types/global";

export async function editUser({
  id,
  name,
}: {
  id: string;
  name: string;
}): Promise<RES_TYPE> {
  const updatedUser = await changeName({ id, name });

  if (updatedUser.status === "error") {
    return updatedUser;
  }

  return {
    status: "success",
    data: updatedUser,
  };
}
