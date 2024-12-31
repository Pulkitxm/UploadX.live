import { RES_TYPE } from "../../types/global.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function isFilePrivate({
  filePath,
  userId,
}: {
  userId: string;
  filePath: string;
}): Promise<RES_TYPE<boolean>> {
  try {
    const project = await prisma.file.findFirst({
      where: {
        userId: userId,
        isPrivate: true,
        path: filePath,
      },
      select: {
        id: true,
        isPrivate: true,
      },
    });

    if (!project || !project?.id) {
      return {
        status: "error",
        error: "File not found",
      };
    }

    return { status: "success", data: project.isPrivate };
  } catch (err) {
    console.error(err);
    return {
      status: "error",
      error: "Error fetching project ID from database",
    };
  }
}
