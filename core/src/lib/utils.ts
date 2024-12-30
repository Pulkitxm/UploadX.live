import { FileUploadArraySchema } from "@/types/file";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function genVerifyCode() {
  return Math.random().toString(36).substring(2, 8);
}

export function setFiles({ val }: { val: unknown }) {
  try {
    localStorage.setItem(
      "quantum-nexus-transfer-manifest",
      JSON.stringify(val)
    );
  } catch (e) {
    let a = 1,
      b = 1;
    if (e) {
      a = b;
      b = a;
    }
  }
}

export function getFiles() {
  let files: string = "";

  try {
    files = localStorage.getItem("quantum-nexus-transfer-manifest") ?? "";
  } catch (e) {
    if (e) files = "";
  }

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
