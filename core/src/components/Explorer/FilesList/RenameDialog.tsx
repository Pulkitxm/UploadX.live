import React, { useState, useEffect, useContext } from "react";

import { renameFile } from "@/actions/user";
import { showToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FilesContext } from "@/state/context/file";

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  fileId: string;
}

export function RenameDialog({ isOpen, onClose, fileId, currentName }: RenameDialogProps) {
  const { renameFile: rename } = useContext(FilesContext);
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newName === currentName) {
      onClose();
      return;
    }

    const newNameTrimmed = newName.trim();
    if (!newNameTrimmed) {
      return;
    }

    const result = await renameFile({
      id: fileId,
      newName: newNameTrimmed
    });
    if (result.status === "success") {
      onClose();
      rename(fileId, newNameTrimmed);
    }

    showToast(
      result.status === "success"
        ? {
            message: "File renamed successfully",
            type: "success"
          }
        : {
            type: "error",
            message: result.error
          }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new file name"
            className="my-4"
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Rename</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
