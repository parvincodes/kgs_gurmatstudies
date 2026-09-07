"use client";

import { useState, type FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PRIORITIES = [
  "Building a personal connection to Gurbani / daily Nitnem",
  "Understanding Sikh history and identity",
  "Character, values, and how to live them day-to-day",
  "Community and friendships within the Sangat",
  "Preparing for a milestone like Amrit Sanchar",
];

const MAX_PRIORITIES = 2;

const ENGAGEMENT_LEVELS = [
  { value: 1, label: "Not very interested" },
  { value: 2, label: "A little" },
  { value: 3, label: "Somewhat" },
  { value: 4, label: "Interested" },
  { value: 5, label: "Very engaged" },
];

export default function SurveyPage() {
  const [childName, setChildName] = useState("");
  const [parentName, setParentName] = useState("");
  const [hopes, setHopes] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [engagement, setEngagement] = useState<number | null>(null);
  const [relevanceIdea, setRelevanceIdea] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function togglePriority(option: string) {
    setPriorities((prev) => {
      if (prev.includes(option)) return prev.filter((p) => p !== option);
      if (prev.length >= MAX_PRIORITIES) return prev;
      return [...prev, option];
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!childName.trim() || !hopes.trim() || priorities.length === 0) {
      setError("Please fill in your child's name, question 1, and at least one priority.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName,
          parentName,
          hopes,
          priorities,
          engagement,
          relevanceIdea,
          notes,
        }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center px-5 py-24">
          <div className="w-full max-w-md rounded-3xl border border-navy/10 bg-cream-dark/40 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron/15 text-saffron-dark">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 className="font-heading mt-5 text-2xl font-bold text-navy">
              Thank you!
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-navy/65">
              We really appreciate you taking a few minutes for this. Your
              answers will directly shape how we run the class this year.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
            Parent Input · 2026&ndash;27 Gurmat Class
          </p>
          <h1 className="font-heading mt-2 text-3xl font-bold text-navy sm:text-4xl">
            What do you hope your child gets from this class?
          </h1>
          <p className="mt-3 text-navy/65">
            Takes about two minutes. There are no wrong answers — this
            directly shapes how we run the year.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-navy">
                  Child&apos;s name
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Simran Kaur"
                  className="mt-2 w-full rounded-full border border-navy/15 bg-cream px-4 py-2.5 text-sm outline-none transition focus:border-saffron"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-navy">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Harpreet Kaur"
                  className="mt-2 w-full rounded-full border border-navy/15 bg-cream px-4 py-2.5 text-sm outline-none transition focus:border-saffron"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                1. What do you hope your child takes away from this class by
                the end of the year?
              </label>
              <textarea
                value={hopes}
                onChange={(e) => setHopes(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-navy/15 bg-cream px-4 py-3 text-sm outline-none transition focus:border-saffron"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                2. Which of these matters most for your child right now?
              </label>
              <p className="mt-1 text-xs text-navy/50">Choose up to two.</p>
              <div className="mt-3 space-y-2">
                {PRIORITIES.map((option) => {
                  const checked = priorities.includes(option);
                  const disabled = !checked && priorities.length >= MAX_PRIORITIES;
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                        checked
                          ? "border-saffron bg-saffron/10 text-navy"
                          : disabled
                            ? "border-navy/10 text-navy/35"
                            : "border-navy/15 text-navy/80 hover:bg-navy/5"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => togglePriority(option)}
                        className="mt-0.5"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                3. How would you describe your child&apos;s current interest
                in Sikhi / Gurmat learning?
              </label>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {ENGAGEMENT_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setEngagement(level.value)}
                    className={`rounded-xl border px-2 py-3 text-center text-xs font-medium transition ${
                      engagement === level.value
                        ? "border-saffron bg-saffron text-navy-dark"
                        : "border-navy/15 text-navy/60 hover:bg-navy/5"
                    }`}
                  >
                    <span className="block text-base font-bold">{level.value}</span>
                    <span className="mt-1 block leading-tight">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                4. What&apos;s one thing that could make this class feel more
                relevant or meaningful to your child specifically?
              </label>
              <textarea
                value={relevanceIdea}
                onChange={(e) => setRelevanceIdea(e.target.value)}
                rows={2}
                className="mt-2 w-full rounded-2xl border border-navy/15 bg-cream px-4 py-3 text-sm outline-none transition focus:border-saffron"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                Anything else you&apos;d like us to know? (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-2 w-full rounded-2xl border border-navy/15 bg-cream px-4 py-3 text-sm outline-none transition focus:border-saffron"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-navy-dark transition hover:bg-saffron-light disabled:opacity-50 sm:w-auto"
            >
              {submitting ? "Sending…" : "Submit"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
