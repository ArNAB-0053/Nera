"use client";

import * as React from "react";
import { cn } from "../lib/utils";

type AvatarContextValue = {
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
};

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

function useAvatarContext() {
  const context = React.useContext(AvatarContext);

  if (!context) {
    throw new Error("Avatar components must be used within Avatar.");
  }

  return context;
}

type AvatarProps = React.ComponentProps<"span">;

function Avatar({ className, ...props }: AvatarProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <AvatarContext.Provider value={{ imageLoaded, setImageLoaded }}>
      <span
        className={cn(
          "relative flex size-10 shrink-0 overflow-hidden rounded-full border border-border/70 bg-brand-soft/55 text-foreground shadow-[var(--shadow-soft)]",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
}

type AvatarImageProps = React.ComponentProps<"img">;

function AvatarImage({ className, onLoad, onError, ...props }: AvatarImageProps) {
  const { setImageLoaded } = useAvatarContext();

  return (
    <img
      className={cn("aspect-square size-full object-cover", className)}
      onLoad={(event) => {
        setImageLoaded(true);
        onLoad?.(event);
      }}
      onError={(event) => {
        setImageLoaded(false);
        onError?.(event);
      }}
      {...props}
    />
  );
}

type AvatarFallbackProps = React.ComponentProps<"span">;

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  const { imageLoaded } = useAvatarContext();

  if (imageLoaded) {
    return null;
  }

  return (
    <span
      className={cn(
        "flex size-full items-center justify-center bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand-soft)_74%,transparent),color-mix(in_oklab,var(--primary)_18%,transparent))] text-sm font-semibold uppercase tracking-[0.08em] text-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
