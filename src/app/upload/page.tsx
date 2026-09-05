"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/PreviewBanner";
import StatusBadge from "@/components/StatusBadge";
import { UploadCloudIcon, FolderIcon, TrashIcon } from "@/components/icons";
import { SUBJECTS, type Subject } from "@/lib/materials";
import type { MaterialRecord } from "@/lib/materials-db";
import { useTeacherAuth } from "@/lib/useTeacherAuth";
import {
  sanitizeFilename,
  formatBytes,
  inferKind,
  titleFromFilename,
} from "@/lib/upload-helpers";

const MAX_CONCURRENT_UPLOADS = 3;

type QueueItem = {
  id: string;
  file: File;
  status: "pending" | "uploading" | "saving" | "done" | "error";
  progress: number;
  error?: string;
};

export default function UploadPage() {
  const {
    passcode,
    name,
    setName,
    checkingPasscode,
    passcodeError,
    verifyPasscode,
    logout,
  } = useTeacherAuth();
  const [passcodeInput, setPasscodeInput] = useState("");

  const [subject, setSubject] = useState<Subject>("Gurbani");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [materials, setMaterials] = useState<MaterialRecord[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadsRef = useRef<QueueItem[]>([]);
  const activeUploadsRef = useRef(0);

  const loadMaterials = useCallback(async (pass: string) => {
    setMaterialsLoading(true);
    try {
      const res = await fetch("/api/materials", {
        headers: { "x-upload-passcode": pass },
      });
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials);
      }
    } finally {
      setMaterialsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (passcode) loadMaterials(passcode);
  }, [passcode, loadMaterials]);

  function addFilesToQueue(fileList: FileList | File[]) {
    const items: QueueItem[] = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      file,
      status: "pending",
      progress: 0,
    }));
    setQueue((prev) => [...prev, ...items]);
    pendingUploadsRef.current.push(...items);
    pumpUploadQueue();
  }

  function pumpUploadQueue() {
    while (
      activeUploadsRef.current < MAX_CONCURRENT_UPLOADS &&
      pendingUploadsRef.current.length > 0
    ) {
      const next = pendingUploadsRef.current.shift();
      if (!next) break;
      activeUploadsRef.current += 1;
      uploadItem(next).finally(() => {
        activeUploadsRef.current -= 1;
        pumpUploadQueue();
      });
    }
  }

  async function uploadItem(item: QueueItem) {
    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "uploading" } : q)),
    );

    const pathname = `materials/${subject}/${Date.now()}-${sanitizeFilename(item.file.name)}`;

    try {
      const blob = await upload(pathname, item.file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: JSON.stringify({ passcode, subject }),
        multipart: item.file.size > 100 * 1024 * 1024,
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
          q.id === item.id ? { ...q, status: "saving", progress: 100 } : q,
        ),
      );

      const saveRes = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-upload-passcode": passcode,
        },
        body: JSON.stringify({
          pathname: blob.pathname,
          url: blob.url,
          subject,
          title: titleFromFilename(item.file.name),
          size: item.file.size,
          uploadedBy: name || null,
        }),
      });

      if (!saveRes.ok) {
        const data = await saveRes.json().catch(() => null);
        throw new Error(
          data?.error
            ? `File uploaded, but details weren't saved: ${data.error}`
            : "File uploaded, but details weren't saved.",
        );
      }

      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: "done", progress: 100 } : q,
        ),
      );
      loadMaterials(passcode);
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

  async function handleDelete(material: MaterialRecord) {
    if (!confirm(`Delete "${material.title}"? This can't be undone.`)) {
      return;
    }
    const res = await fetch(`/api/materials/${material.id}`, {
      method: "DELETE",
      headers: { "x-upload-passcode": passcode },
    });
    if (res.ok) {
      setMaterials((prev) => prev.filter((m) => m.id !== material.id));
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
            Files are stored in Vercel Blob with details in a small
            database. This page is protected by a shared passcode until
            real teacher login is built.
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
              onClick={logout}
              className="rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy/60 hover:bg-navy/5"
            >
              Log out
            </button>
          </div>

          <Link
            href="/review"
            className="mt-3 inline-block text-sm font-medium text-saffron-dark hover:underline"
          >
            Go to review queue →
          </Link>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-navy">
                Your name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Harpreet Kaur"
                className="mt-2 w-full rounded-full border border-navy/15 bg-cream px-4 py-2 text-sm outline-none transition focus:border-saffron"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">
                Subject
              </label>
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
            </div>
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
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-navy/10">
                        <div
                          className="h-full rounded-full bg-saffron transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-xs tabular-nums text-navy/50">
                        {Math.round(item.progress)}%
                      </span>
                    </div>
                  )}
                  {item.status === "saving" && (
                    <span className="text-xs font-medium text-navy/50">
                      Saving details…
                    </span>
                  )}
                  {item.status === "done" && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
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
              Your Uploads
            </h2>
            {materialsLoading ? (
              <p className="mt-4 text-sm text-navy/50">Loading…</p>
            ) : materials.length === 0 ? (
              <p className="mt-4 text-sm text-navy/50">
                Nothing uploaded yet.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-navy/10 overflow-hidden rounded-2xl border border-navy/10 bg-cream">
                {materials.map((material) => (
                  <li
                    key={material.id}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <span className="rounded-full bg-navy/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy/60">
                      {material.subject}
                    </span>
                    <span className="rounded-full bg-saffron/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-saffron-dark">
                      {inferKind(material.pathname)}
                    </span>
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 truncate text-sm font-medium text-navy hover:underline"
                    >
                      {material.title}
                    </a>
                    <StatusBadge status={material.status} />
                    <span className="hidden text-xs text-navy/40 sm:inline">
                      {formatBytes(material.size)}
                    </span>
                    <button
                      onClick={() => handleDelete(material)}
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
