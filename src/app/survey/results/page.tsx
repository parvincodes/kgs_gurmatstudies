"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTeacherAuth } from "@/lib/useTeacherAuth";
import type { SurveyResponse } from "@/lib/survey-db";

export default function SurveyResultsPage() {
  const {
    passcode,
    checkingPasscode,
    passcodeError,
    verifyPasscode,
  } = useTeacherAuth();
  const [passcodeInput, setPasscodeInput] = useState("");

  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const loadResponses = useCallback(async (pass: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/survey", {
        headers: { "x-upload-passcode": pass },
      });
      if (res.ok) {
        const data = await res.json();
        setResponses(data.responses);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (passcode) loadResponses(passcode);
  }, [passcode, loadResponses]);

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
            <h1 className="font-heading text-xl font-bold text-navy">
              Survey Results
            </h1>
            <p className="mt-2 text-sm text-navy/60">
              Enter the shared passcode to view parent survey responses.
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
        <div className="mx-auto max-w-3xl px-5 py-16">
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
            Parent Survey
          </p>
          <h1 className="font-heading mt-2 text-3xl font-bold text-navy">
            Results
          </h1>

          {loading ? (
            <p className="mt-8 text-sm text-navy/50">Loading…</p>
          ) : responses.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-navy/15 py-12 text-center text-sm text-navy/50">
              No responses yet.
            </p>
          ) : (
            <>
              <div className="mt-8 rounded-2xl border border-navy/10 bg-cream p-6">
                <p className="text-3xl font-bold text-navy">{responses.length}</p>
                <p className="mt-1 text-sm text-navy/60">responses so far</p>
              </div>

              <div className="mt-8 space-y-4">
                {responses.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-navy/10 bg-cream p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-heading text-base font-bold text-navy">
                        {r.childName}
                      </p>
                      <span className="text-xs text-navy/40">
                        {r.parentName && `from ${r.parentName} · `}
                        {new Date(r.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-navy/80">
                      <span className="font-semibold">Hopes for this year:</span>{" "}
                      {r.hopes}
                    </p>
                    {r.discussionTopics && (
                      <p className="mt-2 text-sm text-navy/70">
                        <span className="font-semibold">Discussions at home:</span>{" "}
                        {r.discussionTopics}
                      </p>
                    )}
                    {r.identityStruggles && (
                      <p className="mt-2 text-sm text-navy/70">
                        <span className="font-semibold">Identity / Sikhi struggles:</span>{" "}
                        {r.identityStruggles}
                      </p>
                    )}
                    {r.sikhiPractice && (
                      <p className="mt-2 text-sm text-navy/70">
                        <span className="font-semibold">How they practice Sikhi:</span>{" "}
                        {r.sikhiPractice}
                      </p>
                    )}
                    {r.relevanceIdea && (
                      <p className="mt-2 text-sm text-navy/70">
                        <span className="font-semibold">Would help:</span>{" "}
                        {r.relevanceIdea}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
