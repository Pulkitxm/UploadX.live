"use server";

import axios from "axios";
import { ERROR } from "@/types/error";
import { PROFILE_MAX_FILE_SIZE } from "@/lib/config";
import { RES_TYPE } from "@/types/global";
import { uploadFile } from "@/utils/storage";
import { auth } from "@/auth";

export async function upload_FileOrUrl(file: File | string): Promise<RES_TYPE> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { status: "error", error: ERROR.INVALID_SESSION };
    }

    let file_to_upload: Buffer, contentType: string, fileName: string;

    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      file_to_upload = buffer;
      contentType = file.type;
      fileName = file.name;
    } else {
      const response = await axios.get(file, { responseType: "arraybuffer" });
      if (!response.data) {
        return { status: "error", error: ERROR.UPLOAD_FAILED };
      }
      file_to_upload = Buffer.from(response.data);
      contentType = "image/png";
      fileName = file;
    }

    const result = await uploadFile({
      buffer: file_to_upload,
      contentType,
      filename: fileName,
      uploadConfig: {
        type: "FILE"
      }
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
  file: File | string
): Promise<RES_TYPE> {
  const session = await auth();

  if (!session || !session.user) {
    return { status: "error", error: ERROR.INVALID_SESSION };
  }

  if (file instanceof File && file.size > PROFILE_MAX_FILE_SIZE) {
    return { status: "error", error: ERROR.PROFILE_PIC_TOO_LARGE };
  }

  const userId = session.user.id;
  let buffer: Buffer<ArrayBufferLike>;
  let contentType: string;

  if (typeof file === "string") {
    const response = await axios.get(file, { responseType: "arraybuffer" });
    buffer = Buffer.from(response.data);
    contentType = "image/png";
  } else {
    buffer = Buffer.from(await file.arrayBuffer());
    contentType = file.type;
  }

  const res = await uploadFile({
    buffer,
    contentType,
    uploadConfig: {
      type: "PROFILE_PICTURE"
    },
    filename: userId
  });
  return res;
}
