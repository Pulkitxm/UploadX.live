import { RES_TYPE } from "../../types/global.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getIdFromUsername({
  username,
}: {
  username: string;
}): Promise<
  RES_TYPE<{
    id: string;
  }>
> {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });

  if (!user || !user.id) {
    return {
      status: "error",
      error: "User not found",
    };
  } else {
    return {
      status: "success",
      data: {
        id: user.id,
      },
    };
  }
}

export async function isFilePrivate({
  fileName,
  userId,
}: {
  userId: string;
  fileName: string;
}): Promise<
  RES_TYPE<{
    isPrivate: boolean;
    fileId: string;
  }>
> {
  console.log("isFilePrivate", { fileName, userId });

  try {
    const project = await prisma.file.findFirst({
      where: {
        userId: userId,
        name: fileName,
      },
      select: {
        id: true,
        isPrivate: true,
      },
    });

    if (!project || !project?.id || !("isPrivate" in project)) {
      return {
        status: "error",
        error: "File not found",
      };
    }

    return {
      status: "success",
      data: {
        fileId: project.id,
        isPrivate: project.isPrivate,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      status: "error",
      error: "Error fetching project ID from database",
    };
  }
}
