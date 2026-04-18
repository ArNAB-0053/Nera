"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const DEFAULT_AUTO_LOCK_MS = 30 * 60 * 1000;

type VaultContextValue = {
  isUnlocked: boolean;
  unlockVault: (password: string) => void;
  lockVault: () => void;
  getVaultPassword: () => Promise<string>;
};

const VaultContext = createContext<VaultContextValue | null>(null);

type VaultProviderProps = {
  children: ReactNode;
};

export function VaultProvider({ children }: VaultProviderProps) {
  const [vaultPassword, setVaultPassword] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const lockVault = useCallback(() => {
    clearTimer();
    setVaultPassword(null);
  }, [clearTimer]);

  const scheduleAutoLock = useCallback(() => {
    clearTimer();

    if (!vaultPassword) {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setVaultPassword(null);
      timeoutRef.current = null;
    }, DEFAULT_AUTO_LOCK_MS);
  }, [clearTimer, vaultPassword]);

  useEffect(() => {
    scheduleAutoLock();
  }, [scheduleAutoLock]);

  useEffect(() => {
    if (!vaultPassword) {
      return;
    }

    const onActivity = () => scheduleAutoLock();

    window.addEventListener("pointerdown", onActivity);
    window.addEventListener("keydown", onActivity);

    return () => {
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
    };
  }, [scheduleAutoLock, vaultPassword]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const unlockVault = useCallback((password: string) => {
    setVaultPassword(password);
  }, []);

  const getVaultPassword = useCallback(async () => {
    if (vaultPassword) {
      scheduleAutoLock();
      return vaultPassword;
    }

    const promptedPassword = window.prompt("Enter your vault password to unlock local file encryption.");

    if (!promptedPassword) {
      throw new Error("Vault password is required");
    }

    setVaultPassword(promptedPassword);
    return promptedPassword;
  }, [scheduleAutoLock, vaultPassword]);

  const value = useMemo<VaultContextValue>(() => ({
    isUnlocked: Boolean(vaultPassword),
    unlockVault,
    lockVault,
    getVaultPassword,
  }), [getVaultPassword, lockVault, unlockVault, vaultPassword]);

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const context = useContext(VaultContext);

  if (!context) {
    throw new Error("useVault must be used within VaultProvider");
  }

  return context;
}
