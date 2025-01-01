"use server";

import { sendVerificationEmail } from "@/actions/sendEmail";
import { auth } from "@/auth";
import { deleteFileDB, getFilesDB, renameFileDB } from "@/prisma/db/file";
import { changeName } from "@/prisma/db/user";
import { getAttemptsLeft, resetPassword, verifyUser } from "@/prisma/db/user";
import { ERROR } from "@/types/error";
import { FileType } from "@/types/file";
import { RES_TYPE } from "@/types/global";

import { deleteFileFromCloud } from "./storage/azure";

export async function editUser({ name }: { name: string }): Promise<RES_TYPE> {
  const session = await auth();

  if (!session || !session.user) {
    return {
      status: "error",
      error: ERROR.INVALID_SESSION
    };
  }

  const id = session.user.id;
  const updatedUser = await changeName({
    id,
    name
  });

  if (updatedUser.status === "error") {
    return updatedUser;
  }

  return {
    status: "success",
    data: updatedUser
  };
}

async function getUserSessionData(props?: { id?: boolean; email?: boolean }): Promise<RES_TYPE> {
  const session = await auth();
  if (!session || !session.user) {
    return {
      status: "error",
      error: ERROR.USER_NOT_FOUND
    };
  }

  if (props?.id && props?.email) {
    return {
      status: "success",
      data: {
        id: session.user.id,
        email: session.user.email
      }
    };
  } else if (props?.id) {
    return {
      status: "success",
      data: session.user.id
    };
  } else if (props?.email) {
    return {
      status: "success",
      data: session.user.email
    };
  } else {
    return {
      status: "success",
      data: session.user.id
    };
  }
}

export async function verifyUserWithSession({ code }: { code: string }): Promise<RES_TYPE> {
  try {
    const res = await getUserSessionData();
    if (res.status === "error") return res;
    return await verifyUser({
      code,
      userId: res.data
    });
  } catch (error) {
    if (error)
      return {
        status: "error",
        error: ERROR.DB_ERROR
      };
  }

  return {
    status: "error",
    error: ERROR.UNKNOWN
  };
}

export async function sendVerificationEmailWithSession(): Promise<RES_TYPE> {
  try {
    const res = await getUserSessionData({
      email: true,
      id: true
    });

    if (res.status === "error") return res;
    if (!res.data.email || !res.data.id)
      return {
        status: "error",
        error: ERROR.USER_NOT_FOUND
      };

    const at = await sendVerificationEmail({
      userId: res.data.id,
      email: res.data.email
    });
    return at;
  } catch (error) {
    if (error)
      return {
        status: "error",
        error: ERROR.DB_ERROR
      };
  }

  return {
    status: "error",
    error: ERROR.UNKNOWN
  };
}

export async function getAttemptsLeftWithSession(): Promise<RES_TYPE> {
  try {
    const res = await getUserSessionData();

    if (res.status === "error") return res;
    const at = await getAttemptsLeft(res.data);
    return at;
  } catch (error) {
    if (error)
      return {
        status: "error",
        error: ERROR.DB_ERROR
      };
  }

  return {
    status: "error",
    error: ERROR.UNKNOWN
  };
}

export async function resetPasswordForUserWithSession({
  password,
  newPassword
}: {
  password: string;
  newPassword: string;
}): Promise<RES_TYPE> {
  try {
    const res = await getUserSessionData();

    if (res.status === "error") return res;
    return await resetPassword({
      newPassword,
      password,
      userId: res.data
    });
  } catch (error) {
    if (error)
      return {
        status: "error",
        error: ERROR.DB_ERROR
      };
  }

  return {
    status: "error",
    error: ERROR.UNKNOWN
  };
}

export async function getUserFiles(): Promise<RES_TYPE<FileType[]>> {
  try {
    const res = await getUserSessionData();
    if (res.status === "error") return res;
    const files = await getFilesDB({
      userId: res.data
    });
    return files;
  } catch (error) {
    if (error)
      return {
        status: "error",
        error: ERROR.DB_ERROR
      };
  }

  return {
    status: "error",
    error: ERROR.UNKNOWN
  };
}

export async function deleteFile(id: string): Promise<RES_TYPE> {
  try {
    const res = await getUserSessionData();
    if (res.status === "error") return res;

    const resCloud = await deleteFileFromCloud({
      fileId: id,
      userId: res.data
    });

    if (resCloud.status === "error") return resCloud;

    return await deleteFileDB({
      id,
      userId: res.data
    });
  } catch (error) {
    if (error)
      return {
        status: "error",
        error: ERROR.DB_ERROR
      };
  }
  return {
    status: "error",
    error: ERROR.UNKNOWN
  };
}

export async function renameFile({ id, newName }: { id: string; newName: string }): Promise<RES_TYPE> {
  try {
    const res = await getUserSessionData();
    if (res.status === "error") return res;
    console.log("renameFile -> res", res);

    return await renameFileDB({
      id,
      newName,
      userId: res.data
    });
  } catch (error) {
    if (error)
      return {
        status: "error",
        error: ERROR.DB_ERROR
      };
  }
  return {
    status: "error",
    error: ERROR.UNKNOWN
  };
}
