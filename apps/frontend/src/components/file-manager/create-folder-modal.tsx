"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Text } from "@nera/ui";
import { getApiErrorMessage } from "@/services/base";
import { useCreateFolder } from "@/services/folder.service";

type CreateFolderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string | null;
  currentFolderName: string;
};

export function CreateFolderModal({
  open,
  onOpenChange,
  parentId,
  currentFolderName,
}: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const createFolderMutation = useCreateFolder(parentId);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setName("");
      setStatus("");
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setStatus("Enter a folder name.");
      return;
    }

    setStatus("");

    try {
      await createFolderMutation.mutateAsync({ name: name.trim() });
      handleOpenChange(false);
    } catch (error) {
      setStatus(getApiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create folder</DialogTitle>
            <DialogDescription>
              Add a new folder inside {currentFolderName} and keep the explorer structure organized.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label htmlFor="folder-name" className="field-label">
              Folder name
            </label>
            <Input
              id="folder-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Quarterly Reports"
              autoFocus
            />
          </div>

          {status ? (
            <Text as="p" variant="muted">
              {status}
            </Text>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createFolderMutation.isPending}>
              {createFolderMutation.isPending ? "Creating..." : "Create folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
