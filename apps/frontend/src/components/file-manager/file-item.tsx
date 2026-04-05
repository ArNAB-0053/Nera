"use client";

import { CornerUpLeft, FileArchive, FileImage, FileText, FolderClosed, MoreHorizontal } from "lucide-react";
import { Text } from "@nera/ui";
import { formatBytes, formatDateLabel } from "@/lib/utils";
import type { FileRecord, FolderRecord } from "@/services/base";

type FileRowProps =
  | {
      kind: "back";
      onOpen: () => void;
    }
  | {
      kind: "folder";
      item: FolderRecord;
      onOpen: (folderId: string) => void;
    }
  | {
      kind: "file";
      item: FileRecord;
      onOpen: (file: FileRecord) => void;
      isBusy: boolean;
    };

function renderFileIcon(file: FileRecord) {
  if (file.mimeType?.includes("image")) {
    return <FileImage className="ui-icon-sm text-primary" />;
  }

  if (file.mimeType?.includes("pdf")) {
    return <FileText className="ui-icon-sm text-primary" />;
  }

  return <FileArchive className="ui-icon-sm text-primary" />;
}

export function FileRow(props: FileRowProps) {
  if (props.kind === "back") {
    return (
      <tr className="file-row file-go-back-row">
        <td className="file-table-cell p-0" colSpan={5}>
          <button type="button" className="file-row-button" onClick={props.onOpen}>
            <div className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)_auto] items-center gap-4 px-4 py-4">
              <div className="file-row-name">
                <CornerUpLeft className="ui-icon-sm text-primary" />
                <span>Go Back</span>
              </div>
              <Text as="span" variant="muted">
                Folder
              </Text>
              <Text as="span" variant="muted">
                --
              </Text>
              <Text as="span" variant="muted">
                Parent folder
              </Text>
              <span className="file-action-button">
                <MoreHorizontal className="ui-icon-sm" />
              </span>
            </div>
          </button>
        </td>
      </tr>
    );
  }

  if (props.kind === "folder") {
    return (
      <tr className="file-row">
        <td colSpan={5} className="file-table-cell p-0">
          <button type="button" className="file-row-button" onClick={() => props.onOpen(props.item.id)}>
            <div className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)_auto] items-center gap-4 px-4 py-4">
              <div className="file-row-name">
                <FolderClosed className="ui-icon-sm text-primary" />
                <span>{props.item.name}</span>
              </div>
              <Text as="span" variant="muted">
                Folder
              </Text>
              <Text as="span" variant="muted">
                --
              </Text>
              <Text as="span" variant="muted">
                {formatDateLabel(props.item.updatedAt)}
              </Text>
              <span className="file-action-button">
                <MoreHorizontal className="ui-icon-sm" />
              </span>
            </div>
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="file-row">
      <td colSpan={5} className="file-table-cell p-0">
        <button type="button" className="file-row-button" onClick={() => props.onOpen(props.item)} disabled={props.isBusy}>
          <div className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)_auto] items-center gap-4 px-4 py-4">
            <div className="file-row-name">
              {renderFileIcon(props.item)}
              <span>{props.item.name}</span>
            </div>
            <div>
              <span className="file-type-badge">{props.item.mimeType ?? "File"}</span>
            </div>
            <Text as="span" variant="muted">
              {formatBytes(props.item.size)}
            </Text>
            <Text as="span" variant="muted">
              {props.isBusy ? "Preparing..." : formatDateLabel(props.item.updatedAt)}
            </Text>
            <span className="file-action-button">
              <MoreHorizontal className="ui-icon-sm" />
            </span>
          </div>
        </button>
      </td>
    </tr>
  );
}
