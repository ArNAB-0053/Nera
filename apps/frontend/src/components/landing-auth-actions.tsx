"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@nera/ui";
import { useGetCurrentUser } from "@/services/user";
import { UserAvatarMenu } from "./file-manager/user-avatar-menu";

type LandingPrimaryCtaProps = {
  className?: string;
};

export function LandingHeaderActions() {
  const meQuery = useGetCurrentUser();

  if (meQuery.isSuccess) {
    return <UserAvatarMenu showLabel={false} />;
  }

  return (
    <>
      <Button asChild variant="outline" size="sm">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">
          Start free
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </>
  );
}

export function LandingPrimaryCta({ className }: LandingPrimaryCtaProps) {
  const meQuery = useGetCurrentUser();

  if (meQuery.isSuccess) {
    return (
      <Button asChild variant="hero" size="lg" className={className}>
        <Link href="/my-files">
          Continue with Nera
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild variant="hero" size="lg" className={className}>
      <Link href="/sign-up">
        Create your vault
        <ChevronRight className="size-4" />
      </Link>
    </Button>
  );
}

export function LandingFooterCta({ className }: LandingPrimaryCtaProps) {
  const meQuery = useGetCurrentUser();

  if (meQuery.isSuccess) {
    return (
      <Button asChild size="lg" className={className}>
        <Link href="/my-files">
          Continue with Nera
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" className={className}>
      <Link href="/sign-up">
        Create your secure vault
        <ChevronRight className="size-4" />
      </Link>
    </Button>
  );
}
