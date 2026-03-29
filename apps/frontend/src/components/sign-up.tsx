"use client";

import Link from "next/link";
import React, { useState } from "react";
import { RegisterSchema } from "@nera/schemas";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button, Surface, Text } from "@nera/ui";
import { useCreateAccount } from "@/services/auth";

const SignUp = () => {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [message, setMessage] = useState("");
  const registerMutation = useCreateAccount(setMessage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const payload = {
      email: form.email,
      password: form.password,
      ...(form.username.trim() ? { username: form.username.trim() } : {}),
    };
    const parsed = RegisterSchema.safeParse(payload);

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }

    await registerMutation.mutateAsync(parsed.data);
  };

  return (
    <main className="container-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.04fr_0.96fr]">
        <Surface
          variant="elevated"
          padding="lg"
          className="panel-outline relative overflow-hidden border-white/35 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <div className="absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-hero-glow blur-3xl" />
          <div className="relative mx-auto flex max-w-md flex-col gap-8">
            <div className="space-y-3">
              <Text as="p" variant="label">
                Create account
              </Text>
              <Text as="h1" variant="h2" tone="foreground">
                Start your secure vault in a few clean steps.
              </Text>
              <Text as="p" variant="body">
                Set up your workspace once, then keep the same polished experience across files, sharing,
                and recovery.
              </Text>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="field-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="field-input"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="field-label">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Optional display handle"
                  className="field-input"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="field-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="field-input"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Creating account..." : "Create account"}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <Text as="p" variant="muted">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-primary transition-colors hover:text-primary/80">
                Sign in
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

        <Surface
          variant="soft"
          padding="lg"
          className="panel-outline relative overflow-hidden border-white/35 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="absolute inset-x-12 top-0 h-40 rounded-full bg-hero-glow blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-5">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-background/70 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-3">
                <Text as="p" variant="label">
                  Secure by design
                </Text>
                <Text as="h2" variant="h2" tone="foreground">
                  The interface should feel trustworthy before a user uploads the first file.
                </Text>
                <Text as="p" variant="body">
                  This layout keeps the tone simple and premium, with enough structure to make onboarding
                  feel deliberate instead of improvised.
                </Text>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                "Use one account across personal files and shared workspaces.",
                "Keep setup friction low while preserving a privacy-first posture.",
                "Extend the same component language into future dashboards and settings.",
              ].map((item) => (
                <Surface
                  key={item}
                  variant="elevated"
                  padding="md"
                  className="interactive-panel rounded-[var(--radius-xl)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Sparkles className="size-4" />
                    </div>
                    <Text as="p" variant="body">
                      {item}
                    </Text>
                  </div>
                </Surface>
              ))}
            </div>
          </div>
        </Surface>
      </div>
    </main>
  );
};

export default SignUp;
