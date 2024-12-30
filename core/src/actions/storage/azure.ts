"use server";

import { BlobServiceClient } from "@azure/storage-blob";
import { CONNECTION_STRING, FILE_CONTAINER_NAME } from "../../lib/constants";

export async function getDirectorySize(directoryPath: string) {
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(CONNECTION_STRING);
  const containerClient =
    blobServiceClient.getContainerClient(FILE_CONTAINER_NAME);
  let totalSize = 0;

  for await (const blob of containerClient.listBlobsFlat({
    prefix: directoryPath
  })) {
    totalSize += blob.properties.contentLength || 0;
  }

  return formatSize(totalSize);
}

function formatSize(size: number): string {
  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
}
