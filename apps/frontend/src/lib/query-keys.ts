export const queryKeys = {
  me: ["user", "me"] as const,
  tests: ["tests"] as const,
  userByUsername: (username: string) => ["user", "username", username] as const,
  health: ["health"] as const,
};
