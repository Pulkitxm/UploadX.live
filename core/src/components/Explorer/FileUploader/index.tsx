"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect, useCallback, useRef, useContext } from "react";

import { upload_FileOrUrl } from "@/actions/storage/upload";
import { DragOverlay } from "@/components/Explorer/FileUploader/DragOverlay";
import { UploadManager } from "@/components/Explorer/FileUploader/UploadManager";
import { showToast } from "@/components/toast";
import { NEXT_PUBLIC_ASSETS_SERVR_BASE_URL } from "@/lib/constants";
import { FilesContext } from "@/state/context/file";
import { UploadManagerMinimize, UploadsContext } from "@/state/context/upload";
import { FileUpload } from "@/types/file";

export default function FileUploader() {
  const { status } = useSession();
  const { addFile } = useContext(FilesContext);
  const [isDragging, setIsDragging] = useState(false);
  const { uploads, updateUploads } = useContext(UploadsContext);
  const { isMinimized, toggleMinimize } = useContext(UploadManagerMinimize);
  const dragCounter = useRef(0);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          const newUpload: FileUpload = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            status: "uploading",
            createdAt: new Date()
          };

          updateUploads((prevUploads) => [...prevUploads, newUpload]);

          upload_FileOrUrl(file)
            .then((res) => {
              if (res.status === "error") {
                updateUploads((prevUploads) =>
                  prevUploads.map((upload) =>
                    upload.id === newUpload.id
                      ? {
                          ...upload,
                          status: "error"
                        }
                      : upload
                  )
                );
                return showToast({ type: "error", message: res.error });
              }
              addFile({
                id: res.data!,
                name: file.name,
                size: file.size,
                createdAt: new Date(),
                isPrivate: false,
                isStarred: false
              });
              updateUploads((prevUploads) => {
                const newUploads = prevUploads.map((upload) =>
                  upload.id === newUpload.id
                    ? {
                        ...upload,
                        id: res.data!,
                        status: (res.status === "success" ? "completed" : "error") as FileUpload["status"]
                      }
                    : upload
                );
                return newUploads;
              });
            })
            .catch(() => {
              updateUploads((prevUploads) =>
                prevUploads.map((upload) =>
                  upload.id === newUpload.id
                    ? {
                        ...upload,
                        status: "error"
                      }
                    : upload
                )
              );
            });
        });
        toggleMinimize();
      }
    },
    [addFile, toggleMinimize, updateUploads]
  );

  const handleOpenFile = useCallback(
    (fileId: string) => {
      const file = uploads.find((upload) => upload.id === fileId);
      if (file) {
        window.open(`${NEXT_PUBLIC_ASSETS_SERVR_BASE_URL}/f/${file.id}`, "_blank");
      }
    },
    [uploads]
  );

  const handleRemoveFile = useCallback(
    (fileId: string) => {
      updateUploads((prevUploads) => prevUploads.filter((upload) => upload.id !== fileId));
    },
    [updateUploads]
  );

  const handleClearCompleted = useCallback(() => {
    updateUploads((prevUploads) => prevUploads.filter((upload) => upload.status !== "completed"));
  }, [updateUploads]);

  useEffect(() => {
    const bodyElement = document.body;
    bodyElement.addEventListener("dragenter", handleDragIn as unknown as EventListener);
    bodyElement.addEventListener("dragleave", handleDragOut as unknown as EventListener);
    bodyElement.addEventListener("dragover", handleDrag as unknown as EventListener);
    bodyElement.addEventListener("drop", handleDrop as unknown as EventListener);

    return () => {
      bodyElement.removeEventListener("dragenter", handleDragIn as unknown as EventListener);
      bodyElement.removeEventListener("dragleave", handleDragOut as unknown as EventListener);
      bodyElement.removeEventListener("dragover", handleDrag as unknown as EventListener);
      bodyElement.removeEventListener("drop", handleDrop as unknown as EventListener);
    };
  }, [handleDrag, handleDragIn, handleDragOut, handleDrop]);

  if (status === "loading") return null;

  return (
    <>
      <DragOverlay isDragging={isDragging} />
      <UploadManager
        uploads={uploads}
        toggleMinimize={toggleMinimize}
        isMinimized={isMinimized}
        onOpenFile={handleOpenFile}
        onRemoveFile={handleRemoveFile}
        onClearCompleted={handleClearCompleted}
      />
    </>
  );
}
