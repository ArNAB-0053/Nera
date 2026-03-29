"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, Fingerprint, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Surface, Text } from "@nera/ui";
import { getApiErrorMessage } from "@/services/base";
import { useGetCurrentUser } from "@/services/user";

export default function MeView() {
  const router = useRouter();
  const meQuery = useGetCurrentUser();

  useEffect(() => {
    if (meQuery.isError) {
      router.replace("/sign-in");
    }
  }, [meQuery.isError, router]);

  return (
    <main className="container-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Surface
          variant="contrast"
          padding="lg"
          className="panel-outline-strong relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_68%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-5">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/18 bg-white/10">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-3">
                <Text as="p" variant="label" className="text-primary-foreground/78">
                  Secure workspace
                </Text>
                <Text as="h1" variant="h2" tone="inverse">
                  Your vault identity is available and protected.
                </Text>
                <Text as="p" variant="body" className="text-primary-foreground/84">
                  This page confirms the active session and keeps account details clear, accessible, and easy to verify.
                </Text>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                "Protected routes stay behind authenticated access.",
                "Account details are loaded from the backend in real time.",
                "The same query cache can now support dashboard and settings screens.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[var(--radius-xl)] border border-white/14 bg-white/8 px-4 py-3 transition-transform duration-300 ease-out hover:-translate-y-0.5"
                >
                  <Text as="p" variant="muted" className="text-primary-foreground/84">
                    {item}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </Surface>

        <Surface
          variant="elevated"
          padding="lg"
          className="panel-outline relative overflow-hidden border-white/35 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-hero-glow blur-3xl" />
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <Text as="p" variant="label">
                  Account overview
                </Text>
                <Text as="h2" variant="h2" tone="foreground">
                  Nera profile
                </Text>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Back to home
                </Link>
              </Button>
            </div>

            {meQuery.isLoading ? (
              <Surface variant="soft" padding="md" className="rounded-[var(--radius-xl)]">
                <Text as="p" variant="body">
                  Loading your account details...
                </Text>
              </Surface>
            ) : meQuery.isSuccess ? (
              <div className="grid gap-4">
                <Surface variant="soft" padding="md" className="interactive-panel rounded-[var(--radius-xl)]">
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

                <Surface variant="soft" padding="md" className="interactive-panel rounded-[var(--radius-xl)]">
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

                <Surface variant="soft" padding="md" className="interactive-panel rounded-[var(--radius-xl)]">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Fingerprint className="size-4" />
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
              </div>
            ) : (
              <Surface variant="soft" padding="md" className="rounded-[var(--radius-xl)]">
                <Text as="p" variant="label">
                  Session status
                </Text>
                <Text as="p" variant="body" className="mt-3">
                  {getApiErrorMessage(meQuery.error)}
                </Text>
              </Surface>
            )}
          </div>
        </Surface>
      </div>
    </main>
  );
}
