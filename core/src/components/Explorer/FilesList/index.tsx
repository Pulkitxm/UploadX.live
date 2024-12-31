"use client";

import { motion, AnimatePresence } from "framer-motion";
import { File, Star, Lock, MoreVertical, Loader2, Trash2, Download, Eye, Pencil, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NEXT_PUBLIC_ASSETS_SERVR_BASE_URL } from "@/lib/constants";
import { formatFileSize, formatDate } from "@/lib/utils";
import { FilesContext } from "@/state/context/file";
import { FileType } from "@/types/file";

export default function FilesList() {
  const { status } = useSession();
  const { files, loading, deleteFile } = useContext(FilesContext);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(files.length / itemsPerPage);

  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (loading) {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-between px-4 py-2 sm:flex-row">
        <div className="mb-2 flex items-center space-x-2 sm:mb-0">
          <Checkbox id="select-all" checked={selectedFiles.length === files.length} onCheckedChange={handleSelectAll} />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All
          </label>
        </div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="destructive"
              size="sm"
              onClick={selectedFiles.length > 0 ? handleDeleteSelected : undefined}
              className={`flex items-center space-x-2 ${selectedFiles.length === 0 ? "opacity-50" : ""}`}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Selected ({selectedFiles.length})</span>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
      <ScrollArea className="rounded-lg bg-card shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b text-sm font-medium text-muted-foreground">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="hidden px-4 py-3 text-left sm:table-cell">Size</th>
              <th className="hidden px-4 py-3 text-left md:table-cell">Uploaded</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {files
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((file, index) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    deleteFile={deleteFile}
                    isSelected={selectedFiles.includes(file.id)}
                    onSelect={handleSelectFile}
                    index={index}
                  />
                ))}
            </AnimatePresence>
          </tbody>
        </table>
      </ScrollArea>
      <div className="mt-4 flex justify-center space-x-2">
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="flex items-center">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function FileItem({
  file,
  deleteFile,
  isSelected,
  onSelect,
  index
}: {
  file: FileType;
  deleteFile: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  index: number;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="group border-b last:border-b-0 hover:bg-muted/50"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(file.id, checked as boolean)} />
          <div className="relative">
            <File className="h-10 w-10 stroke-[1.5] text-blue-500/20" />
            <File className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="cursor-pointer truncate font-medium"
                title={file.name}
                onClick={() => {
                  window.open(`${NEXT_PUBLIC_ASSETS_SERVR_BASE_URL}/f/${file.id}`, "_blank");
                }}
              >
                {file.name}
              </span>
              <div className="flex gap-1">
                {file.isStarred && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </TooltipTrigger>
                      <TooltipContent>Starred</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {file.isPrivate && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>Private</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{formatFileSize(file.size)}</td>
      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{formatDate(file.createdAt)}</td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                window.open(`${NEXT_PUBLIC_ASSETS_SERVR_BASE_URL}/f/${file.id}`, "_blank");
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" /> Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => deleteFile(file.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </motion.tr>
  );
}

function FileListSkeleton() {
  return (
    <div className="space-y-4">
      <ScrollArea className="h-[calc(100vh-200px)] rounded-lg bg-card shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b text-sm font-medium text-muted-foreground">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="hidden px-4 py-3 text-left sm:table-cell">Size</th>
              <th className="hidden px-4 py-3 text-left md:table-cell">Uploaded</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-4 w-[180px]" />
                  </div>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <Skeleton className="h-4 w-[60px]" />
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <Skeleton className="h-4 w-[100px]" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
