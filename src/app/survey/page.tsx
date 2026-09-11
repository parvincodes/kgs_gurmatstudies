"use client";

import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import {
  OTHER,
  HOPES,
  MAX_HOPES,
  DISCUSSION_TOPICS,
  IDENTITY_STRUGGLES,
  PRACTICE_HABITS,
  PRIORITY_TOPICS,
  MAX_PRIORITY_TOPICS,
  isValidSelection,
} from "@/lib/survey-options";
import { SURVEY_LABEL, getSurveyWindowStatus, formatSurveyWindow } from "@/lib/survey-config";

function MinimalHeader() {
  return (
    <header className="border-b border-navy/10 bg-cream/90 px-5 py-4">
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <Logo size={36} />
        <span className="font-heading text-base font-bold text-navy">
          {SURVEY_LABEL}
        </span>
      </div>
    </header>
  );
}

function toggleIn(setList: Dispatch<SetStateAction<string[]>>, option: string, max?: number) {
  setList((prev) => {
    if (prev.includes(option)) return prev.filter((p) => p !== option);
    if (max !== undefined && prev.length >= max) return prev;
    return [...prev, option];
  });
}

function CheckboxGroup({
  options,
  selected,
  onToggle,
  max,
  allowOther,
  otherText,
  onOtherTextChange,
}: {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  max?: number;
  allowOther?: boolean;
  otherText?: string;
  onOtherTextChange?: (value: string) => void;
}) {
  const allOptions = allowOther ? [...options, OTHER] : options;
  return (
    <div className="mt-3 space-y-2">
      {allOptions.map((option) => {
        const checked = selected.includes(option);
        const disabled = !checked && max !== undefined && selected.length >= max;
        return (
          <div key={option}>
            <label
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
                onChange={() => onToggle(option)}
                className="mt-0.5"
              />
              {option === OTHER ? "Other (please specify)" : option}
            </label>
            {option === OTHER && checked && (
              <input
                type="text"
                value={otherText ?? ""}
                onChange={(e) => onOtherTextChange?.(e.target.value)}
                placeholder="Please specify…"
                className="mt-2 w-full rounded-full border border-navy/15 bg-cream px-4 py-2 text-sm outline-none transition focus:border-saffron"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SurveyPage() {
  const [childName, setChildName] = useState("");
  const [parentName, setParentName] = useState("");

  const [hopesSelected, setHopesSelected] = useState<string[]>([]);
  const [hopesOther, setHopesOther] = useState("");

  const [discussionSelected, setDiscussionSelected] = useState<string[]>([]);
  const [discussionOther, setDiscussionOther] = useState("");

  const [strugglesSelected, setStrugglesSelected] = useState<string[]>([]);
  const [strugglesOther, setStrugglesOther] = useState("");

  const [practiceHabits, setPracticeHabits] = useState<string[]>([]);
  const [priorityTopics, setPriorityTopics] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const windowStatus = getSurveyWindowStatus();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !childName.trim() ||
      !isValidSelection(hopesSelected, hopesOther) ||
      !isValidSelection(discussionSelected, discussionOther) ||
      !isValidSelection(strugglesSelected, strugglesOther) ||
      practiceHabits.length === 0 ||
      priorityTopics.length === 0
    ) {
      setError(
        "Please answer all five questions — if you picked \"Other,\" add a quick note too.",
      );
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
          hopesSelected,
          hopesOther,
          discussionSelected,
          discussionOther,
          strugglesSelected,
          strugglesOther,
          practiceHabits,
          priorityTopics,
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

  if (windowStatus !== "open") {
    return (
      <>
        <MinimalHeader />
        <main className="flex flex-1 items-center justify-center px-5 py-24">
          <div className="w-full max-w-md rounded-3xl border border-navy/10 bg-cream-dark/40 p-10 text-center">
            <h1 className="font-heading text-2xl font-bold text-navy">
              {windowStatus === "before" ? "Survey opens soon" : "Survey closed"}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-navy/65">
              {windowStatus === "before"
                ? `The ${SURVEY_LABEL} isn't open yet.`
                : `The ${SURVEY_LABEL} has closed.`}{" "}
              It runs {formatSurveyWindow()}.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (done) {
    return (
      <>
        <MinimalHeader />
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
      <MinimalHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
            {SURVEY_LABEL} · 2026&ndash;27 Gurmat Class
          </p>
          <h1 className="font-heading mt-2 text-3xl font-bold text-navy sm:text-4xl">
            What do you hope your child gets from this class?
          </h1>
          <p className="mt-3 text-navy/65">
            Takes about two minutes. This is the first of a few check-ins
            we&apos;ll run through the year — we&apos;ll also be asking
            the kids for their own, anonymous thoughts later this
            semester. So please answer from your own perspective as a
            parent, not as a guess at what they&apos;d say. One response
            per child, please — open through {formatSurveyWindow()}.
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
                1. What do you hope your child takes away from this class
                this year?
              </label>
              <p className="mt-1 text-xs text-navy/50">Choose up to two.</p>
              <CheckboxGroup
                options={HOPES}
                selected={hopesSelected}
                onToggle={(o) => toggleIn(setHopesSelected, o, MAX_HOPES)}
                max={MAX_HOPES}
                allowOther
                otherText={hopesOther}
                onOtherTextChange={setHopesOther}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                2. What kind of questions or discussions do the kids have
                with you at home?
              </label>
              <p className="mt-1 text-xs text-navy/50">Check all that apply.</p>
              <CheckboxGroup
                options={DISCUSSION_TOPICS}
                selected={discussionSelected}
                onToggle={(o) => toggleIn(setDiscussionSelected, o)}
                allowOther
                otherText={discussionOther}
                onOtherTextChange={setDiscussionOther}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                3. Do they struggle with anything related to their identity
                or Sikhi?
              </label>
              <p className="mt-1 text-xs text-navy/50">Check all that apply.</p>
              <CheckboxGroup
                options={IDENTITY_STRUGGLES}
                selected={strugglesSelected}
                onToggle={(o) => toggleIn(setStrugglesSelected, o)}
                allowOther
                otherText={strugglesOther}
                onOtherTextChange={setStrugglesOther}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                4. Which of these does your child currently do?
              </label>
              <p className="mt-1 text-xs text-navy/50">Check all that apply.</p>
              <CheckboxGroup
                options={PRACTICE_HABITS}
                selected={practiceHabits}
                onToggle={(o) => toggleIn(setPracticeHabits, o)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy">
                5. Which topics matter most for your child this year?
              </label>
              <p className="mt-1 text-xs text-navy/50">Choose up to two.</p>
              <CheckboxGroup
                options={PRIORITY_TOPICS}
                selected={priorityTopics}
                onToggle={(o) => toggleIn(setPriorityTopics, o, MAX_PRIORITY_TOPICS)}
                max={MAX_PRIORITY_TOPICS}
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
