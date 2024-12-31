import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { FileUploadArraySchema } from "@/types/file";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function genVerifyCode() {
  return Math.random().toString(36).substring(2, 8);
}

export function setFiles({ val }: { val: unknown }) {
  try {
    localStorage.setItem("quantum-nexus-transfer-manifest", JSON.stringify(val));
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

export function formatSize(size: number): string {
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

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}
