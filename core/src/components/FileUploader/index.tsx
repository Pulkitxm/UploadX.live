"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { DragOverlay } from "./DragOverlay";
import { UploadManager } from "./UploadManager";
import { showToast } from "../toast";

interface FileUpload {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

export default function FileUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);
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

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
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
          progress: 0,
          status: "uploading",
        };
        setUploads((prevUploads) => [...prevUploads, newUpload]);
        simulateFileUpload(newUpload.id);
      });
      setIsMinimized(false);
    }
  }, []);

  const simulateFileUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploads((prevUploads) =>
        prevUploads.map((upload) =>
          upload.id === fileId
            ? {
                ...upload,
                progress: Math.min(progress, 100),
                status: progress >= 100 ? "completed" : "uploading",
              }
            : upload,
        ),
      );
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 500);
  };

  const handleOpenFile = (fileId: string) => {
    const file = uploads.find((upload) => upload.id === fileId);
    if (file) {
      showToast({
        type: "success",
        message: `Opening file: ${file.name}`,
      });
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploads((prevUploads) =>
      prevUploads.filter((upload) => upload.id !== fileId),
    );
  };

  useEffect(() => {
    const div = document.body;
    div.addEventListener("dragenter", handleDragIn as unknown as EventListener);
    div.addEventListener(
      "dragleave",
      handleDragOut as unknown as EventListener,
    );
    div.addEventListener("dragover", handleDrag as unknown as EventListener);
    div.addEventListener("drop", handleDrop as unknown as EventListener);

    return () => {
      div.removeEventListener(
        "dragenter",
        handleDragIn as unknown as EventListener,
      );
      div.removeEventListener(
        "dragleave",
        handleDragOut as unknown as EventListener,
      );
      div.removeEventListener(
        "dragover",
        handleDrag as unknown as EventListener,
      );
      div.removeEventListener("drop", handleDrop as unknown as EventListener);
    };
  }, [handleDrag, handleDragIn, handleDragOut, handleDrop]);

  return (
    <>
      <DragOverlay isDragging={isDragging} />
      <UploadManager
        uploads={uploads}
        onMinimize={() => setIsMinimized(!isMinimized)}
        isMinimized={isMinimized}
        onOpenFile={handleOpenFile}
        onRemoveFile={handleRemoveFile}
      />
    </>
  );
}
