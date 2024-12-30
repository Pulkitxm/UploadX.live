"use server";

import axios from "axios";

import { uploadFile } from "@/actions/storage/azure";
import { auth } from "@/auth";
import { PROFILE_MAX_FILE_SIZE, STORAGE_QUOTA } from "@/lib/config";
import { getUserIdOfGoogleUser } from "@/prisma/db/user";
import { ERROR } from "@/types/error";
import { RES_TYPE } from "@/types/global";

import { getCloudStorageUsed } from "./azure";

export async function upload_FileOrUrl(file: File | string): Promise<RES_TYPE> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        status: "error",
        error: ERROR.INVALID_SESSION
      };
    }

    let file_to_upload: Buffer, contentType: string, fileName: string, size: number;

    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      file_to_upload = buffer;
      contentType = file.type;
      fileName = file.name;
      size = file.size;
    } else {
      const response = await axios.get(file, {
        responseType: "arraybuffer"
      });
      if (!response.data) {
        return {
          status: "error",
          error: ERROR.UPLOAD_FAILED
        };
      }
      file_to_upload = Buffer.from(response.data);
      contentType = "image/png";
      fileName = file;
      size = file_to_upload.length;
    }

    if (size > STORAGE_QUOTA) {
      return {
        status: "error",
        error: ERROR.PROFILE_PIC_TOO_LARGE
      };
    } else {
      const res = await getCloudStorageUsed({
        userId: session.user.id
      });

      if (res.status === "error") {
        return res;
      } else {
        const used = res.data;
        if (used + size > STORAGE_QUOTA) {
          return {
            status: "error",
            error: ERROR.STORAGE_QUOTA_EXCEEDED
          };
        }
      }
    }

    const result = await uploadFile({
      buffer: file_to_upload,
      contentType,
      filename: fileName,
      uploadConfig: {
        type: "FILE"
      },
      userId: session.user.id
    });
    return result;
  } catch (error) {
    console.error("Upload action error:", error);
    return {
      status: "error",
      error: ERROR.UPLOAD_FAILED
    };
  }
}

export async function uploadProfilePic_FileOrUrl(
  props:
    | {
        file: File;
        type?: undefined;
      }
    | {
        file: string;
        type: "googleOnnboarding";
        email: string;
      }
): Promise<RES_TYPE> {
  const session = await auth();

  if (props.type !== "googleOnnboarding") {
    const fileSize = props.file.size;

    if (fileSize > PROFILE_MAX_FILE_SIZE) {
      return {
        status: "error",
        error: ERROR.PROFILE_PIC_TOO_LARGE
      };
    }
  }

  if (props.type !== "googleOnnboarding" && (!session || !session.user)) {
    return {
      status: "error",
      error: ERROR.INVALID_SESSION
    };
  }

  if (props.file instanceof File && props.file.size > PROFILE_MAX_FILE_SIZE) {
    console.log({
      size: props.file.size,
      max: PROFILE_MAX_FILE_SIZE,
      err: ERROR.PROFILE_PIC_TOO_LARGE
    });

    return {
      status: "error",
      error: ERROR.PROFILE_PIC_TOO_LARGE
    };
  }

  let userId: string = "";

  if (props.type === "googleOnnboarding") {
    const res = await getUserIdOfGoogleUser(props.email);

    if (res.status === "error") {
      return res;
    } else {
      userId = res.data;
    }
  } else if (session && session.user) {
    userId = session.user.id;
  }

  let buffer: Buffer<ArrayBufferLike>;
  let contentType: string;

  if (typeof props.file === "string") {
    const response = await axios.get(props.file, {
      responseType: "arraybuffer"
    });
    buffer = Buffer.from(response.data);
    contentType = "image/png";
  } else {
    buffer = Buffer.from(await props.file.arrayBuffer());
    contentType = props.file.type;
  }

  const res = await uploadFile({
    buffer,
    contentType,
    uploadConfig: {
      type: "PROFILE_PICTURE"
    },
    filename: userId,
    userId
  });
  return res;
}
