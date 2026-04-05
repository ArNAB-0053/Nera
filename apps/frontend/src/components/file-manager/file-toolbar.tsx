"use client";

import type { ChangeEvent } from "react";
import { FolderPlus } from "lucide-react";
import { Button, Select, Surface, Text } from "@nera/ui";
import type { FileSortBy, SortOrder } from "@/services/base";
import { UploadButton } from "./upload-button";

type FileToolbarProps = {
  folderId: string | null;
  currentFolderName: string;
  sortBy: FileSortBy;
  order: SortOrder;
  onSortByChange: (value: FileSortBy) => void;
  onOrderChange: (value: SortOrder) => void;
  onOpenCreateFolder: () => void;
};

export function FileToolbar({
  folderId,
  currentFolderName,
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
  onOpenCreateFolder,
}: FileToolbarProps) {
  return (
    <Surface variant="elevated" padding="md" className="panel-outline">
      <div className="file-toolbar">
        <div className="space-y-2">
          <Text as="p" variant="label">
            Workspace actions
          </Text>
          <Text as="h2" variant="h3" tone="foreground">
            {currentFolderName}
          </Text>
          <Text as="p" variant="muted">
            Upload files, create folders, and organize content without leaving the explorer.
          </Text>
        </div>

        <div className="file-toolbar-actions">
          <div className="file-toolbar-group">
            <Select
              aria-label="Sort files"
              value={sortBy}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                onSortByChange(event.target.value as FileSortBy)
              }
            >
              <option value="updatedAt">Sort by updated</option>
              <option value="name">Sort by name</option>
              <option value="size">Sort by size</option>
            </Select>

            <Select
              aria-label="Sort order"
              value={order}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                onOrderChange(event.target.value as SortOrder)
              }
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </Select>
          </div>

          <Button type="button" variant="outline" onClick={onOpenCreateFolder}>
            <FolderPlus className="ui-icon-sm" />
            Create folder
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <UploadButton folderId={folderId} />
      </div>
    </Surface>
  );
}
