"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Download, Upload } from "lucide-react";
import { Button, Surface, Text } from "@nera/ui";
import { getApiErrorMessage, type FileRecord } from "@/services/base";
import { useDownloadFile, useUploadFile } from "@/services/file.service";

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function FileTestView() {
  const [folderId, setFolderId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploadedRecord, setUploadedRecord] = useState<FileRecord | null>(null);
  const uploadMutation = useUploadFile(null);
  const downloadMutation = useDownloadFile();

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!selectedFile) {
      setMessage("Choose a file to upload first.");
      return;
    }

    try {
      const data = await uploadMutation.mutateAsync({
        file: selectedFile,
      });

      setUploadedRecord(data);
      setMessage("Upload completed and the database record was returned.");
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    }
  };

  const handleDownload = async () => {
    if (!uploadedRecord?.id) {
      setMessage("Upload a file first so there is an id to download.");
      return;
    }

    setMessage("");

    try {
      const { blob, filename } = await downloadMutation.mutateAsync(uploadedRecord.id);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = filename || uploadedRecord.name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);

      setMessage("Download request completed.");
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    }
  };

  return (
    <main className="container-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <Surface
          variant="contrast"
          padding="lg"
          className="panel-outline-strong relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_68%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-4">
              <Text as="p" variant="label" className="text-primary-foreground/78">
                File route test
              </Text>
              <Text as="h1" variant="h2" tone="inverse">
                Upload a file, inspect the saved DB item, then download it back.
              </Text>
              <Text as="p" variant="body" className="text-primary-foreground/84">
                This screen stays intentionally simple so we can verify the backend contract before investing in the real UI.
              </Text>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[var(--radius-xl)] border border-white/14 bg-white/8 px-4 py-3">
                <Text as="p" variant="muted" className="text-primary-foreground/84">
                  `folderId` is required by the current backend, so it is exposed as a plain input for now.
                </Text>
              </div>
              <div className="rounded-[var(--radius-xl)] border border-white/14 bg-white/8 px-4 py-3">
                <Text as="p" variant="muted" className="text-primary-foreground/84">
                  The download button uses the returned record id from the upload response.
                </Text>
              </div>
            </div>
          </div>
        </Surface>

        <Surface
          variant="elevated"
          padding="lg"
          className="panel-outline relative overflow-hidden border-white/35"
        >
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-hero-glow blur-3xl" />
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <Text as="p" variant="label">
                  Minimal tester
                </Text>
                <Text as="h2" variant="h2" tone="foreground">
                  `/file`
                </Text>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/me">
                  <ArrowLeft className="size-4" />
                  Back to me
                </Link>
              </Button>
            </div>

            <form onSubmit={handleUpload} className="grid gap-5">
              <div className="space-y-2">
                <label htmlFor="folderId" className="field-label">
                  Folder ID (optional)
                </label>
                <input
                  id="folderId"
                  value={folderId}
                  onChange={(event) => setFolderId(event.target.value)}
                  placeholder="Leave empty to upload at root"
                  className="field-input"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="file" className="field-label">
                  File
                </label>
                <input
                  id="file"
                  type="file"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-primary-foreground"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={uploadMutation.isPending}>
                  <Upload className="size-4" />
                  {uploadMutation.isPending ? "Uploading..." : "Upload file"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownload}
                  disabled={!uploadedRecord || downloadMutation.isPending}
                >
                  <Download className="size-4" />
                  {downloadMutation.isPending ? "Downloading..." : "Download returned file"}
                </Button>
              </div>
            </form>

            {message ? (
              <Surface variant="soft" padding="md" className="rounded-[var(--radius-xl)]">
                <Text as="p" variant="label">
                  Status
                </Text>
                <Text as="p" variant="body" className="mt-3">
                  {message}
                </Text>
              </Surface>
            ) : null}

            <Surface variant="soft" padding="md" className="rounded-[var(--radius-xl)]">
              <Text as="p" variant="label">
                Returned DB item
              </Text>
              <pre className="mt-3 overflow-x-auto rounded-2xl bg-background/80 p-4 text-xs leading-6 text-foreground">
                {uploadedRecord ? prettyJson(uploadedRecord) : "Upload a file to see the returned record here."}
              </pre>
            </Surface>
          </div>
        </Surface>
      </div>
    </main>
  );
}
