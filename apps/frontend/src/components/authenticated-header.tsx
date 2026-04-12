"use client";

import { Text } from "@nera/ui";
import { UserAvatarMenu } from "./file-manager/user-avatar-menu";

type AuthenticatedHeaderProps = {
  title: string;
  eyebrow?: string;
};

export function AuthenticatedHeader({ title, eyebrow }: AuthenticatedHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-panel)] border border-border/70 bg-card/72 px-5 py-4 shadow-[var(--shadow-soft)] sm:px-6">
      <div>
        {eyebrow ? (
          <Text as="p" variant="label">
            {eyebrow}
          </Text>
        ) : null}
        <Text as="h1" variant="h2">
          {title}
        </Text>
      </div>
      <UserAvatarMenu />
    </div>
  );
}
