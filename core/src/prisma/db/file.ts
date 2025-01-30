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

export async function getSizeUsedDB({ userId }: { userId: string }): Promise<RES_TYPE<number>> {
  try {
    const files = await db.file.findMany({
      where: {
        userId,
        isDeleted: false
      },
      select: {
        sizeInBytes: true
      }
    });
    const sizeUsed = files.reduce((acc, file) => acc + file.sizeInBytes, 0);
    return { status: "success", data: sizeUsed };
  } catch (error) {
    console.error("Error getting size used from database:", error);
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
        isDeleted: true,
        name: id + "-del"
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

export async function renameFileDB({
  id,
  userId,
  newName
}: {
  id: string;
  userId: string;
  newName: string;
}): Promise<RES_TYPE> {
  try {
    console.log("renameFileDB -> id", id);

    const dbFile = await db.file.findFirst({
      where: {
        name: newName,
        userId,
        isDeleted: false
      },
      select: {
        id: true
      }
    });

    if (dbFile && dbFile.id) {
      return {
        status: "error",
        error: ERROR.FILE_EXISTS
      };
    }

    await db.file.update({
      where: {
        id,
        userId,
        isDeleted: false
      },
      data: {
        name: newName
      }
    });
    return { status: "success" };
  } catch (error) {
    console.error("Error renaming file in database:", error);
    return {
      status: "error",
      error: ERROR.DB_ERROR
    };
  }
}
