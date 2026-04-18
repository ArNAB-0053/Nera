import type { ReactNode } from "react";
import { FilesLayoutShell } from "@/components/file-manager/files-layout-shell";

export default function FilesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <FilesLayoutShell>{children}</FilesLayoutShell>;
}
