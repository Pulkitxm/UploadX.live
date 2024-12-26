'use client'

import React from 'react'
import { ChevronUp, ChevronDown, X, FileIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUpload {
  id: string
  name: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

interface UploadManagerProps {
  uploads: FileUpload[]
  onMinimize: () => void
  isMinimized: boolean
  onOpenFile: (fileId: string) => void
  onRemoveFile: (fileId: string) => void
}

export function UploadManager({ 
  uploads, 
  onMinimize, 
  isMinimized, 
  onOpenFile,
  onRemoveFile
}: UploadManagerProps) {
  const activeUploads = uploads.filter(u => u.status === 'uploading')
  const completedUploads = uploads.filter(u => u.status === 'completed')
  const failedUploads = uploads.filter(u => u.status === 'error')

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-40 w-80 rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out",
      isMinimized ? "h-12" : "h-96"
    )}>
      <div className="flex items-center justify-between rounded-t-lg bg-gray-100 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-700">File Upload Manager</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMinimize}
            aria-label={isMinimized ? "Expand" : "Collapse"}
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {!isMinimized && (
        <ScrollArea className="h-[calc(100%-3rem)] p-4">
          {uploads.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No uploads</p>
          ) : (
            <div className="space-y-6">
              {activeUploads.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploading</h4>
                  <div className="space-y-3">
                    {activeUploads.map((upload) => (
                      <div key={upload.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate flex-1 mr-2">{upload.name}</span>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{upload.progress}%</span>
                        </div>
                        <Progress value={upload.progress} className="h-1 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {completedUploads.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Completed</h4>
                  <div className="space-y-2">
                    {completedUploads.map((upload) => (
                      <div key={upload.id} className="flex items-center justify-between space-x-2 bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm truncate">{upload.name}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onOpenFile(upload.id)}
                        >
                          Open
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {failedUploads.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Failed</h4>
                  <div className="space-y-2">
                    {failedUploads.map((upload) => (
                      <div key={upload.id} className="flex items-center justify-between space-x-2 bg-red-50 p-2 rounded">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm truncate">{upload.name}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onRemoveFile(upload.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  )
}

