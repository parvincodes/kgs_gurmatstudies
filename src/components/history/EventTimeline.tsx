"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { CATEGORIES, PHASES, type Category } from "@/lib/sikh-empire-chronology";

const TOTAL_EVENTS = PHASES.reduce((n, phase) => n + phase.events.length, 0);

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** Everything a search can match for one event, lower-cased, with plain hyphens. */
const SEARCH_TEXT: string[][] = PHASES.map((phase) =>
  phase.events.map((e) =>
    [e.date, e.title, e.description, e.category, e.disputed ? "disputed" : "", phase.name, phase.years]
      .join(" ")
      .toLowerCase()
      .replace(/–/g, "-"),
  ),
);

export default function EventTimeline() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const terms = useMemo(
    () => query.toLowerCase().replace(/–/g, "-").split(/\s+/).filter(Boolean),
    [query],
  );
  const filtering = categories.length > 0 || terms.length > 0;

  const phases = useMemo(
    () =>
      PHASES.map((phase, pi) => ({
        ...phase,
        visible: phase.events.filter(
          (e, ei) =>
            (categories.length === 0 || categories.includes(e.category)) &&
            terms.every((t) => SEARCH_TEXT[pi][ei].includes(t)),
        ),
      })),
    [categories, terms],
  );
  const visibleCount = phases.reduce((n, phase) => n + phase.visible.length, 0);

  function toggleCategory(c: Category) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }
  function togglePhase(name: string) {
    setCollapsed((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
            <SearchIcon className="h-[18px] w-[18px]" />
          </span>
          <input
            id="event-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a name, place or year"
            autoComplete="off"
            className="w-full rounded-full border border-navy/15 bg-cream py-2.5 pl-11 pr-4 text-sm text-navy placeholder:text-navy/40 outline-none transition focus:border-saffron"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Show categories">
          {CATEGORIES.map((c) => {
            const on = categories.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => toggleCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  on ? "bg-navy text-cream" : "bg-navy/5 text-navy/70 hover:bg-navy/10"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm text-navy/60">
          <p role="status" aria-live="polite">
            Showing {visibleCount} of {plural(TOTAL_EVENTS, "event")}
          </p>
          {filtering && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategories([]);
              }}
              className="font-medium text-saffron-dark underline underline-offset-4"
            >
              Clear search and filters
            </button>
          )}
          <button
            type="button"
            onClick={() => setCollapsed([])}
            className="font-medium text-saffron-dark underline underline-offset-4"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(PHASES.map((p) => p.name))}
            className="font-medium text-saffron-dark underline underline-offset-4"
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="mt-8 border-b border-navy/10">
        {phases.map((phase, pi) => {
          if (phase.visible.length === 0) return null;
          const open = !collapsed.includes(phase.name);
          const listId = `phase-list-${pi}`;
          return (
            <div key={phase.name} className="border-t border-navy/10">
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={listId}
                  onClick={() => togglePhase(phase.name)}
                  className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-1 py-4 text-left"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                    className={`self-center text-saffron-dark transition-transform ${open ? "" : "-rotate-90"}`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-heading text-xl font-bold text-navy">{phase.name}</span>
                  {phase.years && (
                    <span className="text-sm font-semibold tabular-nums text-saffron-dark">
                      {phase.years}
                    </span>
                  )}
                  <span className="ml-auto text-sm text-navy/50">
                    {filtering
                      ? `${phase.visible.length} of ${plural(phase.events.length, "event")}`
                      : plural(phase.events.length, "event")}
                  </span>
                </button>
              </h3>

              <ol id={listId} hidden={!open} className="pb-3 pt-1">
                {phase.visible.map((e) => (
                  <li
                    key={`${e.date} ${e.title}`}
                    className="relative pb-5 pl-6 sm:grid sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-11 sm:pl-0"
                  >
                    {/* The spine and its dot. */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-1 top-0 w-px bg-navy/15 sm:left-[calc(8.5rem+1.375rem)]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1.5 h-[9px] w-[9px] rounded-full border-2 border-saffron-dark bg-cream sm:left-[calc(8.5rem+1.375rem-4px)] sm:top-2"
                    />
                    <div className="text-sm font-bold tabular-nums text-saffron-dark sm:pt-0.5 sm:text-right sm:text-navy">
                      {e.date}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-heading text-base font-bold text-navy">{e.title}</h4>
                      <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-navy/65">
                        {e.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-xs font-medium text-navy/60">
                          {e.category}
                        </span>
                        {e.disputed && (
                          <span className="rounded-full border border-dashed border-saffron px-2.5 py-0.5 text-xs font-semibold text-saffron-dark">
                            disputed
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>

      {visibleCount === 0 && (
        <p className="py-8 text-navy/60">
          No events match. Try a different word, or clear the search and filters.
        </p>
      )}
    </div>
  );
}
