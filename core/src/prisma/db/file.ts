import db from "@/prisma/db";
import { ERROR } from "@/types/error";
import { FileType } from "@/types/file";
import { RES_TYPE } from "@/types/global";

export async function addFile({
  userId,
  sizeInBytes,
  name
}: {
  userId: string;
  sizeInBytes: number;
  name: string;
}): Promise<RES_TYPE<string>> {
  try {
    const newFile = await db.file.create({
      data: {
        name,
        sizeInBytes,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
    return { status: "success", data: newFile.id };
  } catch (error) {
    console.error("Error adding file to database:", error);
    return {
      status: "error",
      error: ERROR.DB_ERROR
    };
  }
}

export async function getFilesDB({ userId }: { userId: string }): Promise<RES_TYPE<FileType[]>> {
  try {
    const files = await db.file.findMany({
      where: {
        userId,
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        sizeInBytes: true,
        createdAt: true,
        isPrivate: true,
        isStarred: true
      }
    });
    return {
      status: "success",
      data: files.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.sizeInBytes,
        createdAt: file.createdAt,
        isPrivate: file.isPrivate,
        isStarred: file.isStarred
      }))
    };
  } catch (error) {
    console.error("Error getting files from database:", error);
    return {
      status: "error",
      error: ERROR.DB_ERROR
    };
  }
}

export async function deleteFileDB({ id, userId }: { id: string; userId: string }): Promise<RES_TYPE> {
  try {
    await db.file.update({
      where: {
        id,
        userId
      },
      data: {
        isDeleted: true
      }
    });
    return { status: "success" };
  } catch (error) {
    console.error("Error deleting file from database:", error);
    return {
      status: "error",
      error: ERROR.DB_ERROR
    };
  }
}
