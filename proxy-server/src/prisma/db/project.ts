import { RES_TYPE } from "../../types/global.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function isFilePrivate({
  fileId,
  userId,
}: {
  userId: string;
  fileId: string;
}): Promise<
  RES_TYPE<{
    isPrivate: boolean;
    name: string;
  }>
> {
  console.log("isFilePrivate", { fileId, userId });

  try {
    const project = await prisma.file.findFirst({
      where: {
        userId: userId,
        id: fileId,
      },
      select: {
        id: true,
        isPrivate: true,
        name: true,
      },
    });

    if (
      !project ||
      !project?.id ||
      !project?.name ||
      !("isPrivate" in project)
    ) {
      return {
        status: "error",
        error: "File not found",
      };
    }

    return {
      status: "success",
      data: {
        isPrivate: project.isPrivate,
        name: project.name,
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
