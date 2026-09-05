"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/PreviewBanner";
import StatusBadge from "@/components/StatusBadge";
import FilePreviewPanel from "@/components/FilePreviewPanel";
import { UploadCloudIcon } from "@/components/icons";
import type { MaterialRecord, MaterialStatus } from "@/lib/materials-db";
import { useTeacherAuth } from "@/lib/useTeacherAuth";
import { formatBytes, inferKind } from "@/lib/upload-helpers";

const TABS: { key: MaterialStatus | "all"; label: string }[] = [
  { key: "pending", label: "Needs Review" },
  { key: "flagged", label: "Flagged" },
  { key: "approved", label: "Approved" },
  { key: "all", label: "All" },
];

export default function ReviewPage() {
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

  const [materials, setMaterials] = useState<MaterialRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<MaterialStatus | "all">("pending");
  const [drafts, setDrafts] = useState<
    Record<number, { title: string; description: string }>
  >({});
  const [previewing, setPreviewing] = useState<MaterialRecord | null>(null);

  const loadMaterials = useCallback(async (pass: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/materials", {
        headers: { "x-upload-passcode": pass },
      });
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials);
        setDrafts(
          Object.fromEntries(
            data.materials.map((m: MaterialRecord) => [
              m.id,
              { title: m.title, description: m.description },
            ]),
          ),
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch once a valid passcode is available; loadMaterials only
    // sets state after its own async fetch resolves, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (passcode) loadMaterials(passcode);
  }, [passcode, loadMaterials]);

  function applyUpdate(updated: MaterialRecord) {
    setMaterials((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m)),
    );
    setDrafts((prev) => ({
      ...prev,
      [updated.id]: { title: updated.title, description: updated.description },
    }));
  }

  async function saveDetails(material: MaterialRecord) {
    const draft = drafts[material.id];
    if (!draft) return;
    const res = await fetch(`/api/materials/${material.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-upload-passcode": passcode,
      },
      body: JSON.stringify({ title: draft.title, description: draft.description }),
    });
    if (res.ok) {
      const data = await res.json();
      applyUpdate(data.material);
    }
  }

  async function approve(material: MaterialRecord) {
    const res = await fetch(`/api/materials/${material.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-upload-passcode": passcode,
      },
      body: JSON.stringify({
        action: "review",
        status: "approved",
        reviewedBy: name,
        reviewNote: "",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      applyUpdate(data.material);
    }
  }

  async function flag(material: MaterialRecord) {
    const reason = window.prompt(
      `Why are you flagging "${material.title}" for removal? (optional)`,
    );
    if (reason === null) return;
    const res = await fetch(`/api/materials/${material.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-upload-passcode": passcode,
      },
      body: JSON.stringify({
        action: "review",
        status: "flagged",
        reviewedBy: name,
        reviewNote: reason,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      applyUpdate(data.material);
    }
  }

  async function restoreToPending(material: MaterialRecord) {
    const res = await fetch(`/api/materials/${material.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-upload-passcode": passcode,
      },
      body: JSON.stringify({
        action: "review",
        status: "pending",
        reviewedBy: name,
        reviewNote: "",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      applyUpdate(data.material);
    }
  }

  const visible =
    tab === "all" ? materials : materials.filter((m) => m.status === tab);

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
              Review Materials
            </h1>
            <p className="mt-2 text-sm text-navy/60">
              Enter the shared passcode to review uploaded materials.
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
            Any teacher with the passcode can review materials here.
            Flagging hides a resource from students immediately but keeps
            the file — delete it permanently from the Upload page.
          </PreviewBanner>

          <div className="mt-8 flex items-start justify-between gap-4">
            <div>
              <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
                Peer Review
              </p>
              <h1 className="font-heading mt-2 text-3xl font-bold text-navy">
                Review study materials
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
            href="/upload"
            className="mt-3 inline-block text-sm font-medium text-saffron-dark hover:underline"
          >
            ← Back to upload
          </Link>

          <div className="mt-8 max-w-xs">
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
            <p className="mt-1 text-xs text-navy/50">
              Recorded next to any approval or flag you make.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === t.key
                    ? "bg-navy text-cream"
                    : "bg-navy/5 text-navy/70 hover:bg-navy/10"
                }`}
              >
                {t.label}
                {t.key !== "all" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    {materials.filter((m) => m.status === t.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-sm text-navy/50">Loading…</p>
            ) : visible.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-navy/15 py-12 text-center text-sm text-navy/50">
                Nothing here.
              </p>
            ) : (
              visible.map((material) => {
                const draft = drafts[material.id] ?? {
                  title: material.title,
                  description: material.description,
                };
                const isDirty =
                  draft.title !== material.title ||
                  draft.description !== material.description;

                return (
                  <div
                    key={material.id}
                    className="rounded-2xl border border-navy/10 bg-cream p-6"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-navy/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy/60">
                        {material.subject}
                      </span>
                      <span className="rounded-full bg-saffron/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-saffron-dark">
                        {inferKind(material.pathname)}
                      </span>
                      <StatusBadge status={material.status} />
                      <button
                        onClick={() => setPreviewing(material)}
                        className="ml-auto text-xs font-medium text-saffron-dark hover:underline"
                      >
                        Preview
                      </button>
                    </div>

                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [material.id]: { ...draft, title: e.target.value },
                        }))
                      }
                      className="font-heading mt-4 w-full rounded-lg border border-transparent bg-transparent text-lg font-bold text-navy outline-none transition focus:border-navy/15 focus:bg-cream-dark/40 focus:px-2 focus:py-1"
                    />
                    <textarea
                      value={draft.description}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [material.id]: {
                            ...draft,
                            description: e.target.value,
                          },
                        }))
                      }
                      placeholder="Add a short description of this resource…"
                      rows={2}
                      className="mt-2 w-full rounded-lg border border-navy/10 bg-cream-dark/30 px-3 py-2 text-sm text-navy/80 outline-none transition focus:border-saffron"
                    />

                    <div className="mt-2 flex items-center justify-between text-xs text-navy/40">
                      <span>
                        {formatBytes(material.size)}
                        {material.uploadedBy && ` · Uploaded by ${material.uploadedBy}`}
                      </span>
                      {isDirty && (
                        <button
                          onClick={() => saveDetails(material)}
                          className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-cream hover:bg-navy-light"
                        >
                          Save
                        </button>
                      )}
                    </div>

                    {material.status === "flagged" && (
                      <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                        Flagged{material.reviewedBy && ` by ${material.reviewedBy}`}
                        {material.reviewNote && `: “${material.reviewNote}”`}
                      </p>
                    )}
                    {material.status === "approved" && material.reviewedBy && (
                      <p className="mt-3 text-xs text-green-700">
                        Approved by {material.reviewedBy}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {material.status !== "approved" && (
                        <button
                          onClick={() => approve(material)}
                          className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                        >
                          Approve
                        </button>
                      )}
                      {material.status !== "flagged" && (
                        <button
                          onClick={() => flag(material)}
                          className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Flag for removal
                        </button>
                      )}
                      {material.status !== "pending" && (
                        <button
                          onClick={() => restoreToPending(material)}
                          className="rounded-full border border-navy/15 px-4 py-1.5 text-xs font-semibold text-navy/60 hover:bg-navy/5"
                        >
                          Reset to pending
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
      <Footer />
      <FilePreviewPanel file={previewing} onClose={() => setPreviewing(null)} />
    </>
  );
}
