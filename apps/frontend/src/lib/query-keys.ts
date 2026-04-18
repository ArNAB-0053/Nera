export const queryKeys = {
  me: ["user", "me"] as const,
  tests: ["tests"] as const,
  userByUsername: (username: string) => ["user", "username", username] as const,
  health: ["health"] as const,
  folderView: (folderId: string | null) => ["folder", "view", folderId ?? "root"] as const,
  files: (folderId: string | null, sortBy: string, order: string, search?: string, type?: string) =>
    ["file", "list", folderId ?? "root", sortBy, order, search, type] as const,
};
