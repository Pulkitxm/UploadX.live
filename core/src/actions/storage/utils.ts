import { BlobServiceClient } from "@azure/storage-blob";
import {
  CONNECTION_STRING,
  FILE_CONTAINER_NAME,
  PROFILE_CONTAINER_NAME
} from "@/lib/constants";
import { RES_TYPE } from "@/types/global";
import { ERROR } from "@/types/error";

export async function uploadFile({
  buffer,
  contentType,
  uploadConfig,
  filename
}: {
  buffer: Buffer;
  filename: string;
  contentType: string;
  uploadConfig:
    | {
        type: "PROFILE_PICTURE";
      }
    | {
        type: "FILE";
        path?: string;
      };
}): Promise<RES_TYPE> {
  try {
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(
      uploadConfig.type === "PROFILE_PICTURE"
        ? PROFILE_CONTAINER_NAME
        : FILE_CONTAINER_NAME
    );

    const uploadPath =
      uploadConfig.type === "FILE"
        ? `${uploadConfig.path ? `${uploadConfig.path}/` : ""}${filename}`
        : filename;
    const blockBlobClient = containerClient.getBlockBlobClient(uploadPath);

    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: { blobContentType: contentType }
    });

    return {
      status: "success"
    };
  } catch (error) {
    console.error("Storage upload error:", error);
    return {
      status: "error",
      error: ERROR.UPLOAD_FAILED
    };
  }
}
