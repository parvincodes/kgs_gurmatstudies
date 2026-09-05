"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import FilePreviewPanel from "./FilePreviewPanel";
import { inferKind } from "@/lib/upload-helpers";

type PublicMaterial = {
  id: number;
  title: string;
  description: string;
  subject: string;
  url: string;
  pathname: string;
  size: number;
};

type ChatMessage =
  | { role: "user"; text: string }
  | { role: "bot"; text: string; results?: PublicMaterial[] };

export default function SearchWidget() {
  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState<PublicMaterial[] | null>(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Ask me to find a study material — try a topic, subject, or title.",
    },
  ]);
  const [previewing, setPreviewing] = useState<PublicMaterial | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && materials === null) {
      fetch("/api/public/materials")
        .then((res) => res.json())
        .then((data) => setMaterials(data.materials ?? []))
        .catch(() => setMaterials([]));
    }
  }, [open, materials]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuery("");

    const pool = materials ?? [];
    const needle = q.toLowerCase();
    const results = pool.filter(
      (m) =>
        m.title.toLowerCase().includes(needle) ||
        m.description.toLowerCase().includes(needle) ||
        m.subject.toLowerCase().includes(needle),
    );

    setMessages((prev) => [
      ...prev,
      results.length > 0
        ? {
            role: "bot",
            text: `Found ${results.length} ${results.length === 1 ? "match" : "matches"}:`,
            results,
          }
        : {
            role: "bot",
            text: "No approved materials match that yet. Try a different word, or check back once more are reviewed.",
          },
    ]);
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40">
        {open ? (
          <div className="flex h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-navy/10 bg-cream shadow-2xl">
            <div className="flex items-center justify-between bg-navy px-4 py-3">
              <p className="font-heading text-sm font-bold text-cream">
                Search Study Materials
              </p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="flex h-7 w-7 items-center justify-center rounded-full text-cream/70 hover:bg-cream/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-navy text-cream"
                        : "bg-navy/5 text-navy/80"
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.role === "bot" && m.results && (
                      <div className="mt-2 space-y-1.5">
                        {m.results.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => setPreviewing(r)}
                            className="block w-full rounded-lg bg-cream px-2.5 py-2 text-left text-xs hover:bg-cream-dark"
                          >
                            <span className="font-semibold text-navy">{r.title}</span>
                            <span className="ml-1.5 text-navy/50">
                              {r.subject} · {inferKind(r.pathname)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {materials === null && (
                <p className="text-center text-xs text-navy/40">Loading materials…</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-navy/10 p-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Nitnem, 1984, seva…"
                className="flex-1 rounded-full border border-navy/15 bg-cream px-3 py-2 text-sm outline-none transition focus:border-saffron"
              />
              <button
                type="submit"
                className="rounded-full bg-saffron px-4 py-2 text-sm font-semibold text-navy-dark hover:bg-saffron-light"
              >
                Ask
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            aria-label="Open study materials search"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-cream shadow-xl transition hover:bg-navy-light"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}
      </div>

      <FilePreviewPanel file={previewing} onClose={() => setPreviewing(null)} />
    </>
  );
}
