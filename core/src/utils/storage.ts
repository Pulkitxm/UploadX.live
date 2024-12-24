import { BlobServiceClient } from "@azure/storage-blob";
import { CONNECTION_STRING, CONTAINER_NAME } from "@/lib/constants";
import { RES_TYPE } from "@/types/global";
import { ERROR } from "@/types/error";

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<RES_TYPE> {
  try {
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(CONNECTION_STRING);
    const containerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: { blobContentType: contentType },
    });

    return {
      status: "success",
      data: { url: blockBlobClient.url },
    };
  } catch (error) {
    console.error("Storage upload error:", error);
    return {
      status: "error",
      error: ERROR.UPLOAD_FAILED,
    };
  }
}
