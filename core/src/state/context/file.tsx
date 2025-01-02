import { createContext, Dispatch, SetStateAction } from "react";

import { FileType } from "@/types/file";

interface FilesContextType {
  files: FileType[];
  setFiles: Dispatch<SetStateAction<FileType[]>>;
  loading: boolean;
  reload: () => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  addFile: (file: FileType) => void;
  renameFile: (id: string, newName: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FilesContext = createContext<FilesContextType>({
  files: [],
  setFiles: () => {},
  loading: true,
  reload: async () => {},
  deleteFile: async () => {},
  addFile: () => {},
  renameFile: async () => {},
  searchQuery: "",
  setSearchQuery: () => {}
});
