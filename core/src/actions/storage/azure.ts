"use server";

import { BlobServiceClient } from "@azure/storage-blob";

import { CONNECTION_STRING, FILE_CONTAINER_NAME, PROFILE_CONTAINER_NAME } from "@/lib/constants";
import { ERROR } from "@/types/error";
import { RES_TYPE } from "@/types/global";

const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
const containerClientProfile = blobServiceClient.getContainerClient(PROFILE_CONTAINER_NAME);
const containerClientFile = blobServiceClient.getContainerClient(FILE_CONTAINER_NAME);

export async function getCloudStorageUsed({ userId }: { userId: string }): Promise<RES_TYPE> {
  try {
    let totalSize = 0;

    for await (const blob of containerClientProfile.listBlobsFlat({
      prefix: userId
    })) {
      totalSize += blob.properties.contentLength || 0;
    }

    return {
      status: "success",
      data: totalSize
    };
  } catch (error) {
    console.error("Azure Storage error:", error);
    return {
      status: "error",
      error: ERROR.STORAGE_ERROR
    };
  }
}

export async function uploadFile({
  buffer,
  contentType,
  uploadConfig,
  filename,
  userId
}: {
  buffer: Buffer;
  filename: string;
  contentType: string;
  userId: string;
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
    const containerClient = uploadConfig.type === "PROFILE_PICTURE" ? containerClientProfile : containerClientFile;

    const uploadPath =
      uploadConfig.type === "FILE"
        ? `${userId}/${uploadConfig.path ? `${uploadConfig.path}/` : ""}${filename}`
        : filename;
    const blockBlobClient = containerClient.getBlockBlobClient(uploadPath);

    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: {
        blobContentType: contentType
      }
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

export async function deleteFileFromCloud({ userId, fileId }: { userId: string; fileId: string }): Promise<RES_TYPE> {
  try {
    const containerClient = containerClientFile;
    const blockBlobClient = containerClient.getBlockBlobClient(`${userId}/${fileId}`);

    await blockBlobClient.delete();

    return {
      status: "success"
    };
  } catch (error) {
    console.error("Storage delete error:", error);
    return {
      status: "error",
      error: ERROR.DELETE_FAILED
    };
  }
}
