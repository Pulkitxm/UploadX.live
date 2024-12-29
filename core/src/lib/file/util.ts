import { FileUploadArraySchema } from "@/types/file";

export function setFiles({ userId, val }: { userId: string; val: unknown }) {
  localStorage.setItem(
    `quantum-nexus-transfer-manifest-${userId}`,
    JSON.stringify(val)
  );
}

export function getFiles(userId: string) {
  const files = localStorage.getItem(
    `quantum-nexus-transfer-manifest-${userId}`
  );
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
