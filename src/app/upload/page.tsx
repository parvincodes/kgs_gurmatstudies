"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { upload } from "@vercel/blob/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/PreviewBanner";
import { UploadCloudIcon, FolderIcon, TrashIcon } from "@/components/icons";
import { SUBJECTS, type Subject } from "@/lib/materials";
import {
  sanitizeFilename,
  formatBytes,
  inferKind,
  filenameFromPathname,
  subjectFromPathname,
} from "@/lib/upload-helpers";

const PASSCODE_STORAGE_KEY = "kgs_upload_passcode";

type QueueItem = {
  id: string;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
};

type UploadedFile = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

export default function UploadPage() {
  const [passcode, setPasscode] = useState("");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [checkingPasscode, setCheckingPasscode] = useState(false);

  const [subject, setSubject] = useState<Subject>("Gurbani");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async (pass: string) => {
    setFilesLoading(true);
    try {
      const res = await fetch("/api/upload/list", {
        headers: { "x-upload-passcode": pass },
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
      }
    } finally {
      setFilesLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(PASSCODE_STORAGE_KEY);
    if (stored) {
      verifyPasscode(stored);
    }
  }, []);

  async function verifyPasscode(candidate: string) {
    setCheckingPasscode(true);
    setPasscodeError(null);
    try {
      const res = await fetch("/api/upload/list", {
        headers: { "x-upload-passcode": candidate },
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
        setPasscode(candidate);
        sessionStorage.setItem(PASSCODE_STORAGE_KEY, candidate);
      } else {
        const data = await res.json().catch(() => null);
        setPasscodeError(
          res.status === 401
            ? "That passcode didn't work. Try again."
            : (data?.error ?? "Something went wrong. Try again."),
        );
        sessionStorage.removeItem(PASSCODE_STORAGE_KEY);
      }
    } catch {
      setPasscodeError("Couldn't reach the server. Try again.");
    } finally {
      setCheckingPasscode(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(PASSCODE_STORAGE_KEY);
    setPasscode("");
    setPasscodeInput("");
    setFiles([]);
    setQueue([]);
  }

  function addFilesToQueue(fileList: FileList | File[]) {
    const items: QueueItem[] = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      file,
      status: "pending",
      progress: 0,
    }));
    setQueue((prev) => [...prev, ...items]);
    for (const item of items) {
      void uploadItem(item);
    }
  }

  async function uploadItem(item: QueueItem) {
    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "uploading" } : q)),
    );

    const pathname = `materials/${subject}/${Date.now()}-${sanitizeFilename(item.file.name)}`;

    try {
      await upload(pathname, item.file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: JSON.stringify({ passcode, subject }),
        onUploadProgress: ({ percentage }) => {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, progress: percentage } : q,
            ),
          );
        },
      });
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: "done", progress: 100 } : q,
        ),
      );
      loadFiles(passcode);
    } catch (error) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? {
                ...q,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : q,
        ),
      );
    }
  }

  async function handleDelete(file: UploadedFile) {
    if (!confirm(`Delete "${filenameFromPathname(file.pathname)}"? This can't be undone.`)) {
      return;
    }
    const res = await fetch("/api/upload/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-upload-passcode": passcode,
      },
      body: JSON.stringify({ url: file.url }),
    });
    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f.url !== file.url));
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  }

  if (!passcode) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center px-5 py-24">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyPasscode(passcodeInput);
            }}
            className="w-full max-w-sm rounded-3xl border border-navy/10 bg-cream-dark/40 p-8 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy/5 text-navy">
              <UploadCloudIcon />
            </div>
            <h1 className="font-heading mt-5 text-xl font-bold text-navy">
              Teacher Upload
            </h1>
            <p className="mt-2 text-sm text-navy/60">
              Enter the shared passcode to upload study materials.
            </p>
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Passcode"
              autoFocus
              className="mt-6 w-full rounded-full border border-navy/15 bg-cream px-4 py-2.5 text-center text-sm outline-none transition focus:border-saffron"
            />
            {passcodeError && (
              <p className="mt-2 text-sm text-red-600">{passcodeError}</p>
            )}
            <button
              type="submit"
              disabled={checkingPasscode || !passcodeInput}
              className="mt-4 w-full rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-navy-light disabled:opacity-50"
            >
              {checkingPasscode ? "Checking…" : "Continue"}
            </button>
          </form>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <PreviewBanner>
            Files are stored in Vercel Blob and organized by subject. This
            page is protected by a shared passcode until real teacher
            login is built.
          </PreviewBanner>

          <div className="mt-8 flex items-start justify-between gap-4">
            <div>
              <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
                Teacher Upload
              </p>
              <h1 className="font-heading mt-2 text-3xl font-bold text-navy">
                Add study materials
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy/60 hover:bg-navy/5"
            >
              Log out
            </button>
          </div>

          <div className="mt-8">
            <label className="text-sm font-semibold text-navy">Subject</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    subject === s
                      ? "bg-navy text-cream"
                      : "bg-navy/5 text-navy/70 hover:bg-navy/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-navy/50">
              Applies to files you upload next.
            </p>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
              isDragging
                ? "border-saffron bg-saffron/5"
                : "border-navy/20 bg-cream"
            }`}
          >
            <UploadCloudIcon className="h-10 w-10 text-navy/40" />
            <p className="mt-4 text-sm font-medium text-navy">
              Drag &amp; drop files here
            </p>
            <p className="mt-1 text-xs text-navy/50">
              PDFs, Word docs, PowerPoint, audio, or video
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full bg-saffron px-5 py-2.5 text-sm font-semibold text-navy-dark transition hover:bg-saffron-light"
              >
                Choose Files
              </button>
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-navy/5"
              >
                <FolderIcon className="h-4 w-4" />
                Choose Folder
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && addFilesToQueue(e.target.files)}
            />
            <input
              ref={folderInputRef}
              type="file"
              multiple
              // @ts-expect-error non-standard attributes for folder selection
              webkitdirectory=""
              directory=""
              className="hidden"
              onChange={(e) => e.target.files && addFilesToQueue(e.target.files)}
            />
          </div>

          {queue.length > 0 && (
            <div className="mt-6 space-y-2">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-navy/10 bg-cream px-4 py-3"
                >
                  <span className="flex-1 truncate text-sm text-navy">
                    {item.file.name}
                  </span>
                  <span className="text-xs text-navy/40">
                    {formatBytes(item.file.size)}
                  </span>
                  {item.status === "uploading" && (
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-navy/10">
                      <div
                        className="h-full rounded-full bg-saffron transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.status === "done" && (
                    <span className="text-xs font-semibold text-green-700">
                      Uploaded
                    </span>
                  )}
                  {item.status === "error" && (
                    <span className="text-xs font-semibold text-red-600">
                      {item.error ?? "Failed"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-14">
            <h2 className="font-heading text-lg font-bold text-navy">
              Uploaded Materials
            </h2>
            {filesLoading ? (
              <p className="mt-4 text-sm text-navy/50">Loading…</p>
            ) : files.length === 0 ? (
              <p className="mt-4 text-sm text-navy/50">
                Nothing uploaded yet.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-navy/10 overflow-hidden rounded-2xl border border-navy/10 bg-cream">
                {files.map((file) => (
                  <li
                    key={file.url}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <span className="rounded-full bg-navy/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy/60">
                      {subjectFromPathname(file.pathname)}
                    </span>
                    <span className="rounded-full bg-saffron/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-saffron-dark">
                      {inferKind(file.pathname)}
                    </span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 truncate text-sm font-medium text-navy hover:underline"
                    >
                      {filenameFromPathname(file.pathname)}
                    </a>
                    <span className="hidden text-xs text-navy/40 sm:inline">
                      {formatBytes(file.size)}
                    </span>
                    <button
                      onClick={() => handleDelete(file)}
                      className="text-navy/40 transition hover:text-red-600"
                      aria-label="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
