"use client";

import { Upload, ChevronUp, CheckCircle, AlertCircle, FileIcon, Trash2, X, Clock, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUploadProgress } from "@/hooks/useUploadProgress";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/types/file";

interface UploadManagerProps {
  uploads: FileUpload[];
  toggleMinimize: (props?: { minimize?: boolean }) => void;
  isMinimized: boolean;
  onOpenFile: (fileId: string) => void;
  onRemoveFile: (fileId: string) => void;
  onClearCompleted: () => void;
}

export function UploadManager({
  uploads,
  toggleMinimize,
  isMinimized,
  onOpenFile,
  onRemoveFile,
  onClearCompleted
}: UploadManagerProps) {
  const pathName = usePathname();
  const [initialPath] = useState(pathName);
  const activeUploads = uploads.filter((u) => u.status === "uploading");
  const completedUploads = uploads.filter((u) => u.status === "completed");
  const failedUploads = uploads.filter((u) => u.status === "error");
  const totalUploads = uploads.length;

  useEffect(() => {
    if (pathName !== initialPath) {
      toggleMinimize({
        minimize: true
      });
    }
  }, [initialPath, pathName, toggleMinimize]);

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-40 w-full max-w-sm bg-white shadow-lg transition-all duration-300 ease-in-out sm:max-w-md md:max-w-lg lg:max-w-xl",
        isMinimized ? "h-14" : "h-[32rem] sm:h-[36rem] md:h-[40rem]"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between rounded-tl-lg bg-primary px-4 py-3 text-primary-foreground",
          isMinimized && ""
        )}
      >
        <div className="flex items-center space-x-2">
          {activeUploads.length > 0 ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <h3 className="text-sm font-semibold">Upload Manager {totalUploads ? `(${totalUploads})` : null}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {completedUploads.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearCompleted}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
          <Button
            size="icon"
            onClick={() => toggleMinimize()}
            aria-label={isMinimized ? "Expand" : "Collapse"}
            className={`${isMinimized ? "rotate-180" : ""} transform transition-transform duration-300 ease-in-out`}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {!isMinimized && (
        <ScrollArea className="h-[calc(100%-3.5rem)] bg-gray-50 p-2 md:p-4">
          {uploads.length === 0 ? (
            <p className="flex h-full items-center justify-center text-center text-gray-500">No uploads</p>
          ) : (
            <div className="space-y-6">
              {activeUploads.length > 0 && (
                <UploadSection
                  title="Uploading"
                  uploads={activeUploads}
                  renderItem={(upload) => <DownloadItem key={upload.id} upload={upload} />}
                />
              )}
              {completedUploads.length > 0 && (
                <UploadSection
                  title="Completed"
                  uploads={completedUploads}
                  renderItem={(upload) => (
                    <CompletedItem
                      key={upload.id}
                      upload={upload}
                      onOpenFile={onOpenFile}
                      onRemoveFile={onRemoveFile}
                    />
                  )}
                />
              )}
              {failedUploads.length > 0 && (
                <UploadSection
                  title="Failed"
                  uploads={failedUploads}
                  renderItem={(upload) => <FailedItem key={upload.id} upload={upload} onRemoveFile={onRemoveFile} />}
                />
              )}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}

function UploadSection({
  title,
  uploads,
  renderItem
}: {
  title: string;
  uploads: FileUpload[];
  renderItem: (upload: FileUpload) => React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3 flex items-center text-sm font-medium text-gray-700">
        {title}
        <span className="ml-2 text-xs text-gray-500">({uploads.length})</span>
      </h4>
      <div className="space-y-4">{uploads.map(renderItem)}</div>
    </div>
  );
}

function DownloadItem({ upload: { id, name, size, status } }: { upload: FileUpload }) {
  const progress = useUploadProgress({
    status,
    size
  });
  const uploadedSize = size * (progress / 100);

  return (
    <div key={id} className="rounded-md border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-2 flex min-w-0 items-center space-x-3 sm:mb-0">
          <FileIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {name.length > 20 ? `${name.slice(0, 20)}...` : name}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(uploadedSize)} of {formatFileSize(size)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-xs font-medium text-gray-900">{progress.toFixed(0)}%</p>
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

function CompletedItem({
  upload: { id, name, size, createdAt },
  onOpenFile,
  onRemoveFile
}: {
  upload: FileUpload;
  onOpenFile: (id: string) => void;
  onRemoveFile: (id: string) => void;
}) {
  return (
    <div className="flex flex-col items-start justify-between space-y-2 rounded-md border border-green-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0 sm:p-4">
      <div className="flex min-w-0 flex-1 items-center space-x-3">
        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-green-900">
            {name.length > 20 ? `${name.slice(0, 20)}...` : name}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(size)} • {createdAt.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onOpenFile(id)}
          className="text-green-700 hover:bg-green-100 hover:text-green-900"
        >
          Open
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemoveFile(id)}
          className="text-red-700 hover:bg-red-100 hover:text-red-900"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function FailedItem({
  upload: { id, name, size, createdAt },
  onRemoveFile
}: {
  upload: FileUpload;
  onRemoveFile: (id: string) => void;
}) {
  return (
    <div className="flex flex-col items-start justify-between space-y-2 rounded-md border border-red-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0 sm:p-4">
      <div className="flex min-w-0 flex-1 items-center space-x-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-red-900">
            {name.length > 20 ? `${name.slice(0, 20)}...` : name}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(size)} • {createdAt.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemoveFile(id)}
          className="text-red-700 hover:bg-red-100 hover:text-red-900"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
