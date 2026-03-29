import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  LockKeyhole,
  Moon,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Button, Surface, Text, ThemeToggle } from "@nera/ui";

const features = [
  {
    title: "Encrypt before sync",
    description:
      "Files are protected on your device first, so storage is only holding ciphertext, not usable content.",
    icon: LockKeyhole,
  },
  {
    title: "Control who can open what",
    description:
      "Permission layers, shared vaults, and signed activity trails help teams collaborate without losing control.",
    icon: ShieldCheck,
  },
  {
    title: "Recover faster when things go wrong",
    description:
      "Version snapshots, trusted device approvals, and clear restore flows reduce panic during accidental loss.",
    icon: Workflow,
  },
];

const reasons = [
  "Privacy-first architecture for sensitive files, not generic storage.",
  "A calmer visual language that can scale from auth to dashboards without feeling stitched together.",
  "Reusable surfaces, typography, and actions so later screens stay consistent.",
];

const comparisonRows = [
  {
    label: "Zero-knowledge posture",
    nera: "Designed as the default, not an add-on feature.",
    generic: "Often partial, optional, or limited to specific folders.",
  },
  {
    label: "Audit-friendly sharing",
    nera: "Shared vault actions can be traced by workspace and device.",
    generic: "Sharing is convenient, but oversight is usually shallow.",
  },
  {
    label: "Calm recovery flows",
    nera: "Recovery is treated as part of trust, with guided fallback paths.",
    generic: "Recovery tends to feel technical or fragmented.",
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden pb-16">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/82 backdrop-blur-xl">
        <div className="container-shell flex h-18 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-surface-elevated shadow-sm">
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <div>
              <Text as="span" variant="label">
                Trusted Vault Layer
              </Text>
              <Text as="p" className="font-semibold text-foreground">
                Nera
              </Text>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#what-it-does" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              What it does
            </Link>
            <Link href="#compare" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Compare
            </Link>
            <Link href="#why-nera" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Why use this
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">
                Start free
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="container-shell relative py-10 md:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Surface variant="soft" padding="sm" className="inline-flex w-auto items-center gap-3 rounded-full panel-outline">
              <Sparkles className="size-4 text-primary" />
              <Text as="span" variant="muted" className="text-foreground">
                Secure vault experience for teams that want privacy without friction
              </Text>
            </Surface>

            <div className="space-y-6">
              <Text as="p" variant="label">
                End-to-end trust, designed clearly
              </Text>
              <Text as="h1" variant="display" tone="foreground" className="max-w-4xl">
                Store your most important files in a vault that feels private, polished, and dependable.
              </Text>
              <Text as="p" variant="lead" className="max-w-2xl">
                Nera gives people and teams a secure home for contracts, IDs, financial docs, and other
                sensitive assets without the clutter and uncertainty of generic cloud storage.
              </Text>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link href="/sign-up">
                  Create your vault
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#compare">See how it compares</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["256-bit", "Client-side encryption"],
                ["3 clicks", "Approve a trusted device"],
                ["24/7", "Access from web and future apps"],
              ].map(([value, label]) => (
                <Surface
                  key={label}
                  variant="elevated"
                  padding="sm"
                  className="panel-outline interactive-panel animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <Text as="p" variant="h3" tone="foreground">
                    {value}
                  </Text>
                  <Text as="p" variant="muted">
                    {label}
                  </Text>
                </Surface>
              ))}
            </div>
          </div>

          <Surface
            variant="elevated"
            padding="lg"
            className="panel-outline-strong interactive-panel relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700"
          >
            <div className="absolute inset-x-10 top-0 h-40 rounded-full bg-hero-glow blur-3xl" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Text as="p" variant="label">
                    Vault Status
                  </Text>
                  <Text as="h2" variant="h3" tone="foreground">
                    Your secure space is healthy
                  </Text>
                </div>
                <div className="rounded-full border border-border/70 bg-brand-soft px-3 py-1">
                  <Text as="span" variant="muted" className="text-primary">
                    Protected
                  </Text>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Files encrypted before leaving device",
                  "Shared workspace link protected by vault key",
                  "Recent activity signed from approved device",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-border/60 bg-background/55 p-4 transition-transform duration-300 ease-out hover:-translate-y-0.5"
                  >
                    <div className="mt-0.5 rounded-full bg-primary/12 p-2 text-primary">
                      <Check className="size-4" />
                    </div>
                    <Text as="p" variant="body">
                      {item}
                    </Text>
                  </div>
                ))}
              </div>

              <Surface variant="contrast" padding="md">
                <div className="flex items-start gap-3">
                  <Moon className="mt-1 size-4 shrink-0" />
                  <div>
                    <Text as="p" variant="h3" tone="inverse">
                      Dark mode is built in
                    </Text>
                    <Text as="p" variant="muted" className="text-primary-foreground/80">
                      Your theme switches cleanly with `next-themes`, so the system can scale without repainting every component later.
                    </Text>
                  </div>
                </div>
              </Surface>
            </div>
          </Surface>
        </div>
      </section>

      <section id="what-it-does" className="container-shell section-shell">
        <div className="mb-10 max-w-2xl space-y-4">
          <Text as="p" variant="label">
            What it does
          </Text>
          <Text as="h2" variant="h1" tone="foreground">
            Privacy features users can understand without reading a cryptography paper.
          </Text>
          <Text as="p" variant="lead">
            Clear explanations and consistent hierarchy make the product feel trustworthy at a glance.
          </Text>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <Surface
              key={title}
              variant="elevated"
              padding="lg"
              className="panel-outline interactive-panel space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-primary">
                <Icon className="size-5" />
              </div>
              <div className="space-y-3">
                <Text as="h3" variant="h3" tone="foreground">
                  {title}
                </Text>
                <Text as="p" variant="body">
                  {description}
                </Text>
              </div>
            </Surface>
          ))}
        </div>
      </section>

      <section id="compare" className="container-shell section-shell">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <Text as="p" variant="label">
              Compare with others
            </Text>
            <Text as="h2" variant="h1" tone="foreground">
              Built more like a private vault than a general-purpose drive.
            </Text>
          </div>
          <Text as="p" variant="body" className="max-w-xl">
            The comparison keeps the positioning clear and gives the homepage a stronger product story.
          </Text>
        </div>

        <Surface variant="elevated" padding="none" className="panel-outline overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="hidden grid-cols-[1.1fr_1fr_1fr] border-b border-border/70 bg-surface px-6 py-4 md:grid">
            <Text as="p" variant="label" className="text-foreground">
              Capability
            </Text>
            <Text as="p" variant="label" className="text-foreground">
              Nera vault
            </Text>
            <Text as="p" variant="label" className="text-foreground">
              Typical cloud storage
            </Text>
          </div>

          {comparisonRows.map((row, index) => (
            <div
              key={row.label}
              className={`grid gap-3 px-6 py-5 md:grid-cols-[1.1fr_1fr_1fr] md:gap-4 ${
                index !== comparisonRows.length - 1 ? "border-b border-border/60" : ""
              }`}
            >
              <Text as="p" variant="body" tone="foreground" className="font-medium">
                {row.label}
              </Text>
              <div className="space-y-1">
                <Text as="p" variant="label" className="md:hidden">
                  Nera vault
                </Text>
                <Text as="p" variant="body">{row.nera}</Text>
              </div>
              <div className="space-y-1">
                <Text as="p" variant="label" className="md:hidden">
                  Typical cloud storage
                </Text>
                <Text as="p" variant="body">{row.generic}</Text>
              </div>
            </div>
          ))}
        </Surface>
      </section>

      <section id="why-nera" className="container-shell section-shell">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Surface variant="contrast" padding="lg" className="panel-outline-strong space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Text as="p" variant="label" className="text-primary-foreground/78">
              Why use this
            </Text>
              <Text as="h2" variant="h2" tone="inverse">
                Trust is not just encryption. It is also clarity, consistency, and control.
              </Text>
              <Text as="p" variant="body" className="text-primary-foreground/82">
                The product feels stronger when security, layout, and navigation all communicate the same
                level of care.
              </Text>
          </Surface>

          <div className="grid gap-4">
            {reasons.map((reason) => (
              <Surface
                key={reason}
                variant="elevated"
                padding="md"
                className="panel-outline interactive-panel flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
              >
                <div className="mt-1 rounded-full bg-brand-soft p-2 text-primary">
                  <Check className="size-4" />
                </div>
                <Text as="p" variant="body">
                  {reason}
                </Text>
              </Surface>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell section-shell">
        <Surface
          variant="soft"
          padding="lg"
          className="panel-outline flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div className="max-w-2xl space-y-3">
            <Text as="p" variant="label">
              Ready to launch
            </Text>
            <Text as="h2" variant="h2" tone="foreground">
              Start with a cleaner first impression, then reuse the same UI language across the product.
            </Text>
          </div>
          <Button asChild size="lg">
            <Link href="/sign-up">
              Open your first vault
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Surface>
      </section>

      <footer className="container-shell pt-8">
        <div className="flex flex-col gap-6 border-t border-border/70 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Text as="p" variant="h3" tone="foreground">
              Nera
            </Text>
            <Text as="p" variant="muted">
              Secure vault platform for people who want their files to feel protected, not just stored.
            </Text>
          </div>

          <div className="flex flex-wrap gap-6">
            <Link href="#what-it-does" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#compare" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Comparison
            </Link>
            <Link href="#why-nera" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Why Nera
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
