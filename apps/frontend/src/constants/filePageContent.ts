import { FilesRouteKind } from "./types";

export const FILE_PAGE_CONTENT: Record<
  FilesRouteKind,
  {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  }
> = {
  "my-files": {
    title: "My Files",
    description: "Browse folders, upload files, and manage the main workspace without leaving the shared explorer shell.",
    emptyTitle: "Nothing here yet",
    emptyDescription: "Upload a file or create a folder to start organizing your workspace.",
  },
  recent: {
    title: "Recent",
    description: "A quick, non-reloading view of your most recently updated files.",
    emptyTitle: "No recent files",
    emptyDescription: "Files you open or update most recently will appear here.",
  },
  pinned: {
    title: "Pinned",
    description: "A focused space for items you want to keep within reach.",
    emptyTitle: "No pinned items yet",
    emptyDescription: "Pinned items are not available from the current API yet, so this view stays ready for them.",
  },
  trash: {
    title: "Trash",
    description: "Review deleted items from the same explorer layout before destructive actions are wired up.",
    emptyTitle: "Trash is empty",
    emptyDescription: "Deleted items will appear here when the API starts returning them.",
  },
};