import type { Metadata } from "next";
import { ThemeProvider } from "@nera/ui";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { VaultProvider } from "@/providers/vault-provider";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Nera Vault",
  description: "Private cloud vault with end-to-end trust built into every file flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <VaultProvider>{children}</VaultProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
