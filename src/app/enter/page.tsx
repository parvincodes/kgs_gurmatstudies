"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

function EnterForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        // Same passcode gates /upload and /review too — save it so
        // teachers aren't asked for it a second time right after this.
        sessionStorage.setItem("kgs_upload_passcode", passcode);
        window.location.href = next;
      } else {
        setError("That passcode didn't work. Try again.");
      }
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-navy px-5 py-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-cream/10 bg-navy-light/40 p-8 text-center"
      >
        <div className="mx-auto flex items-center justify-center">
          <Logo size={56} />
        </div>
        <h1 className="font-heading mt-5 text-xl font-bold text-cream">
          Khalsa Gurmat School
        </h1>
        <p className="mt-2 text-sm text-cream/60">
          This study portal is in early preview. Enter the shared
          passcode to continue.
        </p>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          autoFocus
          className="mt-6 w-full rounded-full border border-cream/15 bg-navy px-4 py-2.5 text-center text-sm text-cream outline-none transition focus:border-saffron"
        />
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={checking || !passcode}
          className="mt-4 w-full rounded-full bg-saffron px-6 py-2.5 text-sm font-semibold text-navy-dark transition hover:bg-saffron-light disabled:opacity-50"
        >
          {checking ? "Checking…" : "Continue"}
        </button>
      </form>
    </main>
  );
}

export default function EnterPage() {
  return (
    <Suspense fallback={null}>
      <EnterForm />
    </Suspense>
  );
}
