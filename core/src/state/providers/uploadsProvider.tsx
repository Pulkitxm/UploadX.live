"use client";

import React, { useState, ReactNode, useCallback, useEffect } from "react";
import { FileUpload } from "@/types/file";
import { getFiles, setFiles } from "@/lib/utils";
import { UploadManagerMinimize, UploadsContext } from "@/state/context/upload";

export const UploadsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [uploads, setUploads] = useState<FileUpload[]>(getFiles());

  const updateUploads = useCallback(
    (updater: FileUpload[] | ((prevUploads: FileUpload[]) => FileUpload[])) => {
      setUploads((prevUploads) => {
        const newUploads =
          typeof updater === "function" ? updater(prevUploads) : updater;
        setFiles({
          val: newUploads
        });
        return newUploads;
      });
    },
    []
  );

  return (
    <UploadsContext.Provider
      value={{ uploads, setUploads, setFiles, updateUploads }}
    >
      {children}
    </UploadsContext.Provider>
  );
};

export const UploadManagerMinimizeProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = useCallback((props?: { minimize?: boolean }) => {
    setIsMinimized((prev) => {
      const newValue = props?.minimize !== undefined ? props.minimize : !prev;
      localStorage.setItem(
        "uploadManagerMinimize",
        newValue ? "true" : "false"
      );
      return newValue;
    });
  }, []);

  useEffect(() => {
    const value = localStorage.getItem("uploadManagerMinimize");
    setIsMinimized(value === "true");
  }, []);

  return (
    <UploadManagerMinimize.Provider value={{ isMinimized, toggleMinimize }}>
      {children}
    </UploadManagerMinimize.Provider>
  );
};
