import { useEffect, useState } from "react";

import { FileUpload } from "@/types/file";

function getRandWait(fileSize: number) {
  const baseDelay = Math.min(fileSize / 100_000, 5000);
  const randomFactor = 0.5 + Math.random();
  return Math.max(1000, baseDelay * randomFactor);
}

export const useUploadProgress = ({ size, status }: { status: FileUpload["status"]; size: number }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === "uploading") {
      const updateInterval = getRandWait(size);
      const maxProgress = size < 1_000_000 ? 95 : 85;

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= maxProgress) return prev;
          return prev + Math.random() * 5;
        });
      }, updateInterval);
    }

    if (status === "completed") {
      setProgress(100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, size]);

  return progress;
};
