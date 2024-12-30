"use client";

import { FileUploadArraySchema } from "@/types/file";

export function setFiles({ val }: { val: unknown }) {
  localStorage.setItem("quantum-nexus-transfer-manifest", JSON.stringify(val));
}

export function getFiles() {
  const files = localStorage.getItem("quantum-nexus-transfer-manifest");
  if (files) {
    const parsedFiles = JSON.parse(files);
    const validatedFiles = FileUploadArraySchema.safeParse(parsedFiles);

    if (validatedFiles.success) {
      return validatedFiles.data.map((file) => ({
        ...file,
        status: file.status === "uploading" ? "error" : file.status
      }));
    }

    return [];
  }
  return [];
}
