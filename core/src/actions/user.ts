"use server";

import { sendVerificationEmail } from "@/actions/sendEmail";
import { auth } from "@/auth";
import { changeName } from "@/prisma/db/user";
import { getAttemptsLeft, resetPassword, verifyUser } from "@/prisma/db/user";
import { ERROR } from "@/types/error";
import { RES_TYPE } from "@/types/global";

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
