"use client";

import React, { useState, ReactNode, useEffect, useCallback } from "react";

import { deleteFile, getUserFiles } from "@/actions/user";
import { FilesContext } from "@/state/context/file";
import { FileType } from "@/types/file";

export const FilesProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchFiles = useCallback(async () => {
    setLoading(true);
    const res = await getUserFiles();
    if (res.status === "success" && res.data) {
      setFiles(res.data);
    }
    setLoading(false);
  }, []);

  const addFile = useCallback((file: FileType) => {
    setFiles((prev) => [file, ...prev]);
  }, []);

  const handleDeletFile = useCallback(async (id: string) => {
    setLoading(true);
    const res = await deleteFile(id);
    if (res.status === "success") {
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    handleFetchFiles();
  }, [handleFetchFiles]);

  return (
    <FilesContext.Provider
      value={{ files, setFiles, loading, reload: handleFetchFiles, deleteFile: handleDeletFile, addFile }}
    >
      {children}
    </FilesContext.Provider>
  );
};
