"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/PreviewBanner";
import { SearchIcon } from "@/components/icons";
import { MATERIALS, SUBJECTS, type Subject } from "@/lib/materials";

const SUBJECT_STYLES: Record<Subject, string> = {
  Gurbani: "bg-saffron/15 text-saffron-dark",
  History: "bg-navy/10 text-navy",
  Philosophy: "bg-gold/20 text-navy",
};

export default function MaterialsPage() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<Subject | "All">("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MATERIALS.filter((m) => {
      const matchesSubject = subject === "All" || m.subject === subject;
      const matchesQuery =
        q.length === 0 ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q));
      return matchesSubject && matchesQuery;
    });
  }, [query, subject]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <PreviewBanner>
            This is a preview with sample materials so we can gather
            feedback. Real content, saved search history, and login are
            coming soon.
          </PreviewBanner>

          <div className="mt-8 max-w-xl">
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
              Study Materials
            </p>
            <h1 className="font-heading mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Find what you&apos;re studying
            </h1>
            <p className="mt-3 text-navy/65">
              Search across Gurbani, history, and philosophy materials from
              this year&apos;s program.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
                <SearchIcon className="h-[18px] w-[18px]" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search materials, e.g. &quot;Nitnem&quot;"
                className="w-full rounded-full border border-navy/15 bg-cream py-2.5 pl-11 pr-4 text-sm text-navy placeholder:text-navy/40 outline-none transition focus:border-saffron"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(["All", ...SUBJECTS] as const).map((s) => (
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

          <p className="mt-6 text-sm text-navy/50">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>

          {results.length > 0 ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((m) => (
                <article
                  key={m.id}
                  className="flex flex-col rounded-2xl border border-navy/10 bg-cream p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${SUBJECT_STYLES[m.subject]}`}
                    >
                      {m.subject}
                    </span>
                    <span className="rounded-full bg-navy/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy/60">
                      {m.type}
                    </span>
                  </div>
                  <h3 className="font-heading mt-4 text-base font-bold text-navy">
                    {m.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
                    {m.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-cream-dark px-2 py-0.5 text-xs text-navy/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-16 rounded-2xl border border-dashed border-navy/15 py-16 text-center text-navy/50">
              No materials match your search yet. Try a different term or
              subject.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
