"use client";

import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilesContext } from "@/state/context/file";

import { FileItem } from "./FileItem";
import { FileListSkeleton } from "./FileListSekeleton";
import { Pagination } from "./Pagination";

export default function FilesList() {
  const { status } = useSession();
  const { files, loading, deleteFile } = useContext(FilesContext);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(files.length / itemsPerPage);

  if (status === "loading" || loading) {
    return <FileListSkeleton />;
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(files.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
    }
  };

  const handleDeleteSelected = async () => {
    await Promise.all(selectedFiles.map((fileId) => deleteFile(fileId)));
    setSelectedFiles([]);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = files.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(startIndex, endIndex);

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-5xl flex-grow space-y-4">
        <div className="sticky top-0 z-10 flex flex-col items-center justify-between gap-2 bg-background px-4 py-2 sm:flex-row">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedFiles.length === files.length}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All
            </label>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={selectedFiles.length > 0 ? handleDeleteSelected : undefined}
            className={`flex items-center space-x-2 ${selectedFiles.length === 0 ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400" : "bg-red-400 hover:bg-red-600"}`}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Selected ({selectedFiles.length})</span>
          </Button>
        </div>

        <ScrollArea className="rounded-lg border bg-card">
          <table className="w-full">
            <thead className="hidden sm:table-header-group">
              <tr className="border-b text-sm font-medium text-muted-foreground">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="hidden px-4 py-3 text-left sm:table-cell">Size</th>
                <th className="hidden px-4 py-3 text-left md:table-cell">Uploaded</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFiles.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  deleteFile={deleteFile}
                  isSelected={selectedFiles.includes(file.id)}
                  onSelect={handleSelectFile}
                />
              ))}
            </tbody>
          </table>
        </ScrollArea>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>
    </div>
  );
}
