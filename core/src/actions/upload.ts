"use server";

import axios from "axios";
import { ERROR } from "@/types/error";
import { MAX_FILE_SIZE } from "@/lib/config";
import { RES_TYPE } from "@/types/global";
import { uploadFile } from "@/utils/storage";

export async function uploadFileAction(
  formData: FormData,
  userId: string,
): Promise<RES_TYPE> {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { status: "error", error: ERROR.FILE_REQUIRED };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { status: "error", error: ERROR.FILE_TOO_LARGE };
    }

    const result = await uploadFileOrUrl(file, userId);

    return result;
  } catch (error) {
    console.error("Upload action error:", error);
    return {
      status: "error",
      error: ERROR.UPLOAD_FAILED,
    };
  }
}

export async function uploadFileOrUrl(file: File | string, userId: string) {
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

  const res = await uploadFile(buffer, userId, contentType);
  console.log(`Uploaded file: ${JSON.stringify(res)}`);

  return res;
}
