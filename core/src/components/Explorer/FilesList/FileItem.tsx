import { File, Star, Lock, MoreVertical, Trash2, Download, Eye, Pencil, Share2 } from "lucide-react";
import React, { useState } from "react";

import { showToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NEXT_PUBLIC_ASSETS_SERVR_BASE_URL } from "@/lib/constants";
import { formatFileSize, formatDate } from "@/lib/utils";
import { FileType } from "@/types/file";

import { RenameDialog } from "./RenameDialog";

interface FileItemProps {
  file: FileType;
  deleteFile: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

export function FileItem({ file, deleteFile, isSelected, onSelect }: FileItemProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  return (
    <tr className="flex w-full flex-col border-b last:border-b-0 hover:bg-muted/50 sm:table-row">
      <td className="w-full px-4 py-3 sm:w-auto sm:py-4">
        <div className="flex items-center gap-3">
          <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(file.id, checked as boolean)} />
          <div className="relative hidden sm:block">
            <File className="h-10 w-10 stroke-[1.5] text-blue-500/20" />
            <File className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="cursor-pointer truncate font-medium hover:underline"
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
      <td className="px-4 py-3 text-right sm:py-4">
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
            <DropdownMenuItem
              onClick={() =>
                window.open(
                  `${NEXT_PUBLIC_ASSETS_SERVR_BASE_URL}/f/${file.id}?download=true&ts=${Date.now()}`,
                  "_blank"
                )
              }
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsRenameDialogOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(`${NEXT_PUBLIC_ASSETS_SERVR_BASE_URL}/f/${file.id}`);
                showToast({
                  message: "Link copied to clipboard",
                  type: "success"
                });
              }}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => deleteFile(file.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
      <RenameDialog
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        currentName={file.name}
        fileId={file.id}
      />
    </tr>
  );
}
