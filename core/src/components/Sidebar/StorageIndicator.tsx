"use client";

import { useContext } from "react";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { STORAGE_QUOTA } from "@/lib/config";
import { FilesContext } from "@/state/context/file";

import type React from "react"; // Added import for React

function formatSize(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    return `${gb.toFixed(1)} GB`;
  }
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${Math.round(mb)} MB`;
  }
  const kb = bytes / 1024;
  if (kb >= 1) {
    return `${Math.round(kb)} KB`;
  }
  return `${bytes} Bytes`;
}

export default function StorageIndicator() {
  const { files, loading } = useContext(FilesContext);

  const storageUsed = files?.reduce((acc, file) => acc + file.size, 0);

  if (loading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  const percentageUsed = (storageUsed / STORAGE_QUOTA) * 100;

  return (
    <div className="w-full space-y-3">
      <Progress value={percentageUsed} className="h-2 w-full" />
      <div className="text-center text-sm text-muted-foreground">
        {formatSize(storageUsed)} of {formatSize(STORAGE_QUOTA)}
      </div>
    </div>
  );
}
