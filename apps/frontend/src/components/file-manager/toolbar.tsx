"use client";

import { FolderPlus, Upload } from "lucide-react";
import { Button, Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Text } from "@nera/ui";
import type { FileSortBy, SortOrder } from "@/services/base";

type ToolbarProps = {
  isUploading: boolean;
  onUploadClick: () => void;
  onCreateFolder: () => void;
  sortBy: FileSortBy;
  order: SortOrder;
  onSortByChange: (value: FileSortBy) => void;
  onOrderChange: (value: SortOrder) => void;
};

export function Toolbar({
  isUploading,
  onUploadClick,
  onCreateFolder,
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
}: ToolbarProps) {
  return (
    <div className="file-toolbar">
      <Text as="p" variant="muted">
        Organize folders and files from one place.
      </Text>

      <div className="file-toolbar-actions">
        <Button type="button" variant="outline" onClick={onCreateFolder}>
          <FolderPlus className="ui-icon-sm" />
          New Folder
        </Button>

        <Button type="button" onClick={onUploadClick} disabled={isUploading} className="h-10">
          <Upload className="ui-icon-sm" />
          {isUploading ? "Uploading..." : "Upload"}
        </Button>

        <Dropdown>
          <DropdownTrigger label="Sort" />
          <DropdownContent>
            <DropdownItem active={sortBy === "name"} onClick={() => onSortByChange("name")}>
              Name
            </DropdownItem>
            <DropdownItem active={sortBy === "updatedAt"} onClick={() => onSortByChange("updatedAt")}>
              Date
            </DropdownItem>
            <DropdownItem active={sortBy === "size"} onClick={() => onSortByChange("size")}>
              Size
            </DropdownItem>
            <DropdownItem active={order === "asc"} onClick={() => onOrderChange("asc")}>
              Ascending
            </DropdownItem>
            <DropdownItem active={order === "desc"} onClick={() => onOrderChange("desc")}>
              Descending
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
}
