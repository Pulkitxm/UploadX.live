/* eslint-disable @typescript-eslint/no-unused-vars */ import { FileUpload } from "@/types/file";
import { createContext } from "react";

export const UploadsContext = createContext<{
  uploads: FileUpload[];
  setUploads: React.Dispatch<React.SetStateAction<FileUpload[]>>;
  setFiles: ({ val }: { val: unknown }) => void;
  updateUploads: (
    updater: FileUpload[] | ((prevUploads: FileUpload[]) => FileUpload[])
  ) => void;
}>({
  uploads: [],
  setUploads: () => [],
  setFiles: ({ val }: { val: unknown }) => {},
  updateUploads: (
    updater: FileUpload[] | ((prevUploads: FileUpload[]) => FileUpload[])
  ) => {}
});

export const UploadManagerMinimize = createContext<{
  isMinimized: boolean;
  toggleMinimize: (props?: { minimize?: boolean }) => void;
}>({ isMinimized: true, toggleMinimize: () => {} });
