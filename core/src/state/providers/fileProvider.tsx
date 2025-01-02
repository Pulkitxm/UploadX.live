"use client";

import React, { useState, ReactNode, useEffect, useCallback, useMemo } from "react";

import { deleteFile, getUserFiles } from "@/actions/user";
import { FilesContext } from "@/state/context/file";
import { FileType } from "@/types/file";

export const FilesProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fileWithQuery = useMemo(() => {
    if (!searchQuery) return files;
    return files.filter((file) => file.name.includes(searchQuery));
  }, [files, searchQuery]);

  const changeQuery = useCallback((query: string) => {
    localStorage.setItem("searchQuery", query);
    setSearchQuery(query);
  }, []);

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
    const res = await deleteFile(id);
    if (res.status === "success") {
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    }
  }, []);

  const handelRenameFile = useCallback((id: string, newName: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id === id) {
          return { ...file, name: newName };
        }
        return file;
      })
    );
  }, []);

  useEffect(() => {
    handleFetchFiles();
  }, [handleFetchFiles]);
  useEffect(() => {
    setSearchQuery(localStorage.getItem("searchQuery") || "");
  }, []);

  return (
    <FilesContext.Provider
      value={{
        files: fileWithQuery,
        setFiles,
        loading,
        reload: handleFetchFiles,
        deleteFile: handleDeletFile,
        addFile,
        renameFile: handelRenameFile,
        searchQuery,
        setSearchQuery: changeQuery
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};
