import { FileUpload } from "@/types/file";
import { useEffect, useState } from "react";

function getRandWait(fileSize: number) {
  const baseDelay = Math.min(fileSize / 100_000, 5000);
  const randomFactor = 0.5 + Math.random();
  return Math.max(1000, baseDelay * randomFactor);
}

export const useUploadProgress = ({
  size,
  status
}: {
  status: FileUpload["status"];
  size: number;
}) => {
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "uploading") {
      const updateInterval = getRandWait(size);
      const maxProgress = size < 1_000_000 ? 95 : 85;

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= maxProgress) return prev;
          return prev + Math.random() * 5;
        });
      }, updateInterval);

      setIntervalId(interval);
    }

    if (status === "completed") {
      if (intervalId) clearInterval(intervalId);
      setProgress(100);
    }

    if (status === "error") {
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status, size, intervalId]);

  return progress;
};
