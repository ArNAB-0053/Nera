"use client";

import { useEffect } from "react";
import {
  CheckCircle2,
  HardDrive,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, Surface, Text } from "@nera/ui";
import { formatBytes, formatDateLabel } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/base";
import { useGetCurrentUser } from "@/services/user";
import { AuthenticatedHeader } from "@/components/authenticated-header";

const MAX_USER_STORAGE_BYTES = 2 * 1024 * 1024 * 1024;
const PLAN_NAME = "Free";

function getInitials(email: string, username?: string | null) {
  const source = username?.trim() || email;
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export default function MeView() {
  const router = useRouter();
  const meQuery = useGetCurrentUser();

  useEffect(() => {
    if (meQuery.isError) {
      router.replace("/sign-in");
    }
  }, [meQuery.isError, router]);

  return (
    <main className="container-shell py-10">
      <AuthenticatedHeader title="Profile settings" eyebrow="Account" />

      {meQuery.isLoading ? (
        <Surface variant="soft" padding="lg" className="rounded-[var(--radius-xl)]">
          <Text as="p" variant="body">
            Loading your account details...
          </Text>
        </Surface>
      ) : meQuery.isSuccess ? (
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-6">
            <Surface variant="elevated" padding="lg" className="rounded-[var(--radius-2xl)]">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarFallback>{getInitials(meQuery.data.data.email, meQuery.data.data.username)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-1">
                    <Text as="p" variant="body" tone="foreground" className="truncate font-semibold">
                      {meQuery.data.data.username || "Username not set"}
                    </Text>
                    <Text as="p" variant="muted" className="truncate">
                      {meQuery.data.data.email}
                    </Text>
                    <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {PLAN_NAME} Plan
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Text as="p" variant="label">
                        Storage Usage
                      </Text>
                      <Text as="p" variant="muted">
                        {formatBytes(meQuery.data.data.totalStorageUsed)} / {formatBytes(MAX_USER_STORAGE_BYTES)}
                      </Text>
                    </div>
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <HardDrive className="size-4" />
                    </div>
                  </div>
                  <div className="file-storage-progress">
                    <div
                      className="file-storage-progress-bar"
                      style={{
                        width: `${Math.min(
                          (meQuery.data.data.totalStorageUsed / MAX_USER_STORAGE_BYTES) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <Surface variant="soft" padding="md" className="rounded-[var(--radius-xl)]">
                  <div className="space-y-3">
                    <Text as="p" variant="label">
                      Small info / tips
                    </Text>
                    {[
                      "Storage updates automatically after successful uploads.",
                      "Your account details are fetched from the active session.",
                      "Use logout below if you are on a shared device.",
                    ].map((tip) => (
                      <div key={tip} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                        <Text as="p" variant="muted">
                          {tip}
                        </Text>
                      </div>
                    ))}
                  </div>
                </Surface>
              </div>
            </Surface>
          </div>

          <div className="space-y-6">
            <Surface variant="elevated" padding="lg" className="rounded-[var(--radius-2xl)]">
              <div className="space-y-8">
                <section className="space-y-4">
                  <div>
                    <Text as="p" variant="label">
                      Account Details
                    </Text>
                    <Text as="p" variant="muted">
                      Core profile information for your current Nera account.
                    </Text>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Surface variant="soft" padding="md" className="rounded-[var(--radius-xl)]">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <Mail className="size-4" />
                        </div>
                        <div className="space-y-1">
                          <Text as="p" variant="label">
                            Email
                          </Text>
                          <Text as="p" variant="body" tone="foreground">
                            {meQuery.data.data.email}
                          </Text>
                        </div>
                      </div>
                    </Surface>

                    <Surface variant="soft" padding="md" className="rounded-[var(--radius-xl)]">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <UserRound className="size-4" />
                        </div>
                        <div className="space-y-1">
                          <Text as="p" variant="label">
                            Username
                          </Text>
                          <Text as="p" variant="body" tone="foreground">
                            {meQuery.data.data.username || "Not set"}
                          </Text>
                        </div>
                      </div>
                    </Surface>
                  </div>

                  <Surface variant="soft" padding="md" className="rounded-[var(--radius-xl)]">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <ShieldCheck className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <Text as="p" variant="label">
                          User ID
                        </Text>
                        <Text as="p" variant="body" tone="foreground" className="break-all">
                          {meQuery.data.data.id}
                        </Text>
                      </div>
                    </div>
                  </Surface>
                </section>

                <section className="space-y-4">
                  <div>
                    <Text as="p" variant="label">
                      Security
                    </Text>
                    <Text as="p" variant="muted">
                      Session and verification information for this signed-in account.
                    </Text>
                  </div>
                  <Surface variant="soft" padding="md" className="rounded-[var(--radius-xl)]">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <ShieldCheck className="size-4" />
                      </div>
                      <div className="space-y-2">
                        <Text as="p" variant="label">
                          Session info
                        </Text>
                        <Text as="p" variant="muted">
                          Signed in and authenticated.
                        </Text>
                        <Text as="p" variant="muted">
                          Verified: {meQuery.data.data.isVerified ? "Yes" : "No"}
                        </Text>
                        <Text as="p" variant="muted">
                          Account created: {meQuery.data.data.createdAt ? formatDateLabel(meQuery.data.data.createdAt) : "Unavailable"}
                        </Text>
                      </div>
                    </div>
                  </Surface>
                </section>

                <section className="space-y-4">
                  <div>
                    <Text as="p" variant="label">
                      Actions
                    </Text>
                    <Text as="p" variant="muted">
                      Use the avatar menu in the header to open My Files, view your profile, or log out.
                    </Text>
                  </div>
                </section>
              </div>
            </Surface>
          </div>
        </div>
      ) : (
        <Surface variant="soft" padding="lg" className="rounded-[var(--radius-xl)]">
          <Text as="p" variant="label">
            Session status
          </Text>
          <Text as="p" variant="body" className="mt-3">
            {getApiErrorMessage(meQuery.error)}
          </Text>
        </Surface>
      )}
    </main>
  );
}
