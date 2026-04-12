"use client";

import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Text,
} from "@nera/ui";
import { LogOut, Settings } from "lucide-react";
import { useLogoutSession } from "@/services/auth";
import { useGetCurrentUser } from "@/services/user";

function getDisplayName(email: string, username?: string | null) {
  if (username?.trim()) {
    return username.trim();
  }

  return email.split("@")[0] || "User";
}

function getAvatarInitials(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function UserAvatarMenu() {
  const router = useRouter();
  const meQuery = useGetCurrentUser();
  const logoutMutation = useLogoutSession();
  const user = meQuery.data?.data;

  const email = user?.email ?? "Loading account";
  const username = user?.username?.trim() ? user.username.trim() : null;
  const displayName = user ? getDisplayName(user.email, username) : "User";
  const initials = getAvatarInitials(displayName);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.replace("/sign-in");
    } catch {
      router.replace("/sign-in");
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger
        showChevron={false} 
        variant="avatar"
        aria-label="Open account menu"
        className="h-auto rounded-[var(--radius-pill)] transition-all duration-200 group "
      >
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <Text as="p" variant="label" className="text-[0.56rem] tracking-[0.18em] translate-y-[3.5px]">
              Account
            </Text>
            <Text as="p" variant="muted" tone="foreground" className="max-w-32 truncate font-medium text-[0.8rem]">
              {displayName}
            </Text>
          </div>

          <Avatar className="size-10 bg-transparent">
            <AvatarFallback className="bg-accent/5 group-hover:bg-accent transition-all duration-200 ">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownTrigger>

      {/* <DropdownTrigger showChevron={false} variant="avatar">
        <Avatar className="size-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
      </DropdownTrigger> */}

      <DropdownContent className="w-72 animate-in fade-in zoom-in-95 duration-200 ">
        <div className="rounded-[var(--radius-xl)] border border-border/65 bg-background/55 p-4">
          <Text as="p" variant="body" tone="foreground" className="font-semibold">
            {displayName}
          </Text>
          {username && username !== displayName ? (
            <Text as="p" variant="muted" className="mt-1">
              @{username}
            </Text>
          ) : null}
          {user?.email ? (
            <Text as="p" variant="muted" className="mt-1 break-all">
              {user.email}
            </Text>
          ) : (
            <Text as="p" variant="muted" className="mt-1">
              {email}
            </Text>
          )}
        </div>

        <div className="my-2 h-px bg-border/70" />

        <DropdownItem
          needCheck={false}
          className="gap-3 justify-start"
          onClick={() => router.push("/me")}
        >
          <Settings className="ui-icon-sm text-muted-foreground" />
          <span>Settings</span>
        </DropdownItem>

        <DropdownItem
          needCheck={false}
          className="gap-3 justify-start text-destructive hover:bg-destructive/8 hover:text-destructive"
          onClick={() => void handleLogout()}
        >
          <LogOut className="ui-icon-sm" />
          <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
