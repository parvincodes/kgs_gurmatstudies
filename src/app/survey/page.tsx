"use client";

import { useState, type FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SurveyPage() {
  const [childName, setChildName] = useState("");
  const [parentName, setParentName] = useState("");
  const [hopes, setHopes] = useState("");
  const [discussionTopics, setDiscussionTopics] = useState("");
  const [identityStruggles, setIdentityStruggles] = useState("");
  const [sikhiPractice, setSikhiPractice] = useState("");
  const [relevanceIdea, setRelevanceIdea] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!childName.trim() || !hopes.trim()) {
      setError("Please fill in your child's name and question 1.");
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
          discussionTopics,
          identityStruggles,
          sikhiPractice,
          relevanceIdea,
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
            Takes about two minutes. This is the first step — we&apos;ll
            also be asking the kids for their own, anonymous thoughts
            later this semester. So please answer from your own
            perspective as a parent, not as a guess at what they&apos;d
            say.
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
                2. What kind of questions or discussions do the kids have
                with you?
              </label>
              <p className="mt-1 text-xs text-navy/50">Optional.</p>
              <textarea
                value={discussionTopics}
                onChange={(e) => setDiscussionTopics(e.target.value)}
                rows={2}
                className="mt-2 w-full rounded-2xl border border-navy/15 bg-cream px-4 py-3 text-sm outline-none transition focus:border-saffron"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                3. Do they struggle with anything related to their identity
                or Sikhi?
              </label>
              <p className="mt-1 text-xs text-navy/50">
                Optional — totally fine to say no, or to skip this one.
              </p>
              <textarea
                value={identityStruggles}
                onChange={(e) => setIdentityStruggles(e.target.value)}
                rows={2}
                className="mt-2 w-full rounded-2xl border border-navy/15 bg-cream px-4 py-3 text-sm outline-none transition focus:border-saffron"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                4. In what ways do they practice Sikhi — paath, seva, or
                other ways they live out the values?
              </label>
              <p className="mt-1 text-xs text-navy/50">Optional.</p>
              <textarea
                value={sikhiPractice}
                onChange={(e) => setSikhiPractice(e.target.value)}
                rows={2}
                className="mt-2 w-full rounded-2xl border border-navy/15 bg-cream px-4 py-3 text-sm outline-none transition focus:border-saffron"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                5. What&apos;s one thing that could make this class feel
                more relevant or meaningful to your child specifically?
              </label>
              <p className="mt-1 text-xs text-navy/50">Optional.</p>
              <textarea
                value={relevanceIdea}
                onChange={(e) => setRelevanceIdea(e.target.value)}
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
