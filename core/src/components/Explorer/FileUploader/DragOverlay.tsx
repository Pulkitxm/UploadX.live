import { Upload } from "lucide-react";
import React from "react";

interface DragOverlayProps {
  isDragging: boolean;
}

export function DragOverlay({ isDragging }: DragOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-blue-500 bg-opacity-90 transition-opacity duration-300 ${
        isDragging ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isDragging}
    >
      <div className="text-center text-white">
        <Upload className="mx-auto mb-8 h-24 w-24 animate-bounce" aria-hidden="true" />
        <h2 className="mb-4 text-4xl font-bold">Drop your files here</h2>
        <p className="text-xl">Release anywhere to upload your files</p>
      </div>
    </div>
  );
}
