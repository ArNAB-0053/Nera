"use client";

import Link from "next/link";
import React, { useState } from "react";
import { LoginSchema } from "@nera/schemas";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { Button, Surface, Text } from "@nera/ui";
import { useCreateSession } from "@/services/auth";
import { useVault } from "@/providers/vault-provider";

const SignIn = () => {
  const { unlockVault } = useVault();
  const [form, setForm] = useState({ identifier: "", password: "", otp: "", vaultPassword: "" });
  const [message, setMessage] = useState("");
  const loginMutation = useCreateSession(setMessage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const parsed = LoginSchema.safeParse(form);

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Please enter your credentials.");
      return;
    }

    await loginMutation.mutateAsync(parsed.data);

    if (form.vaultPassword.trim()) {
      unlockVault(form.vaultPassword);
    }
  };

  return (
    <main className="container-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Surface
          variant="contrast"
          padding="lg"
          className="panel-outline-strong relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_68%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-5">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/18 bg-white/10">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-3">
                <Text as="p" variant="label" className="text-primary-foreground/78">
                  Welcome back
                </Text>
                <Text as="h1" variant="h2" tone="inverse">
                  Pick up right where your secure workspace left off.
                </Text>
                <Text as="p" variant="body" className="text-primary-foreground/84">
                  Review activity, access protected files, and continue from an approved device without
                  fighting the interface.
                </Text>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                "Encrypted files stay private before they sync.",
                "Trusted device approvals keep access calm and predictable.",
                "Workspace history stays visible when you need to verify changes.",
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
          <div className="relative mx-auto flex max-w-md flex-col gap-8">
            <div className="space-y-3">
              <Text as="p" variant="label">
                Account access
              </Text>
              <Text as="h2" variant="h2" tone="foreground">
                Sign in to Nera
              </Text>
              <Text as="p" variant="body">
                Use your email or username to unlock your vault and continue securely.
              </Text>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="identifier" className="field-label">
                  Email or username
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="field-input"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="password" className="field-label">
                    Password
                  </label>
                  <span className="text-xs text-muted-foreground">Private and secure</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="field-input"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="otp" className="field-label">
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Required only if 2FA is enabled"
                  className="field-input"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="vaultPassword" className="field-label">
                  Vault password
                </label>
                <input
                  id="vaultPassword"
                  name="vaultPassword"
                  type="password"
                  value={form.vaultPassword}
                  onChange={handleChange}
                  placeholder="Optional: unlock file encryption for this session"
                  className="field-input"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <Surface variant="soft" padding="md" className="interactive-panel rounded-[var(--radius-xl)]">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <KeyRound className="size-4" />
                </div>
                <div className="space-y-1">
                  <Text as="p" variant="h3" tone="foreground">
                    New here?
                  </Text>
                  <Text as="p" variant="muted">
                    Create an account and start organizing sensitive files with a calmer, cleaner vault
                    experience.
                  </Text>
                </div>
              </div>
            </Surface>

            <Text as="p" variant="muted">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-semibold text-primary transition-colors hover:text-primary/80">
                Create one
              </Link>
            </Text>

            {message && (
              <Surface variant="soft" padding="md" className="rounded-[var(--radius-xl)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Text as="p" variant="label">
                  Status
                </Text>
                <Text as="p" variant="body" className="mt-3">
                  {message}
                </Text>
              </Surface>
            )}
          </div>
        </Surface>
      </div>
    </main>
  );
};

export default SignIn;
