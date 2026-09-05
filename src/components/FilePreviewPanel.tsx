"use client";

import { useEffect } from "react";
import { inferKind } from "@/lib/upload-helpers";

export type PreviewableFile = {
  title: string;
  url: string;
  pathname: string;
};

const OFFICE_KINDS = new Set(["Word Doc", "PowerPoint"]);

export default function FilePreviewPanel({
  file,
  onClose,
}: {
  file: PreviewableFile | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!file) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [file, onClose]);

  if (!file) return null;

  const kind = inferKind(file.pathname);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-navy-dark/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex h-full w-full flex-col bg-cream shadow-2xl sm:w-[560px]">
        <div className="flex items-center gap-3 border-b border-navy/10 px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-bold text-navy">
              {file.title}
            </p>
            <p className="text-xs text-navy/50">{kind}</p>
          </div>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-navy/15 px-3 py-1.5 text-xs font-semibold text-navy/70 hover:bg-navy/5"
          >
            Open in new tab
          </a>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-navy/50 hover:bg-navy/5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden bg-navy/5">
          {kind === "PDF" && (
            <iframe
              src={file.url}
              title={file.title}
              className="h-full w-full border-0"
            />
          )}

          {OFFICE_KINDS.has(kind) && (
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`}
              title={file.title}
              className="h-full w-full border-0"
            />
          )}

          {kind === "Audio" && (
            <div className="flex h-full items-center justify-center px-8">
              <audio controls src={file.url} className="w-full" />
            </div>
          )}

          {kind === "Video" && (
            <div className="flex h-full items-center justify-center bg-black">
              <video controls src={file.url} className="max-h-full max-w-full" />
            </div>
          )}

          {kind === "File" && (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
              <p className="text-sm text-navy/60">
                No in-browser preview available for this file type.
              </p>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-cream hover:bg-navy-light"
              >
                Open in new tab
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
