import { z } from "zod";

export const FileUploadSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  status: z.enum(["uploading", "completed", "error"]),
  createdAt: z.string().transform((val) => new Date(val))
});
export const FileUploadArraySchema = z.array(FileUploadSchema);

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "completed" | "error";
  createdAt: Date;
}

export interface UploadProgress {
  progress: number;
  error: Error | null;
  isUploading: boolean;
}

export type UploadFunction = (
  onProgress: (progressEvent: ProgressEvent) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;
