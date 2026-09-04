import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/PreviewBanner";
import { SUBJECTS, type Subject } from "@/lib/materials";

const SAMPLE_PROGRESS: Record<Subject, number> = {
  Gurbani: 60,
  History: 40,
  Philosophy: 25,
};

const RECENTLY_COVERED = [
  { title: "Japji Sahib: An Introduction", subject: "Gurbani" as Subject },
  { title: "Understanding the Mool Mantar", subject: "Gurbani" as Subject },
  { title: "1947: What Happened and Why", subject: "History" as Subject },
  { title: "Core Ideas in Sikh Philosophy", subject: "Philosophy" as Subject },
];

export default function ProgressPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <PreviewBanner>
            Sample data — this is what your personal progress tracker
            could look like once student &amp; teacher login is live.
          </PreviewBanner>

          <div className="mt-8 max-w-xl">
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
              Your Progress
            </p>
            <h1 className="font-heading mt-2 text-3xl font-bold text-navy sm:text-4xl">
              What you&apos;ve covered this year
            </h1>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {SUBJECTS.map((subject) => (
              <div
                key={subject}
                className="rounded-2xl border border-navy/10 bg-cream p-6"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-heading text-base font-bold text-navy">
                    {subject}
                  </h3>
                  <span className="font-heading text-lg font-bold text-saffron-dark">
                    {SAMPLE_PROGRESS[subject]}%
                  </span>
                </div>
                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-navy/10">
                  <div
                    className="h-full rounded-full bg-saffron"
                    style={{ width: `${SAMPLE_PROGRESS[subject]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="font-heading text-lg font-bold text-navy">
              Recently Covered
            </h2>
            <ul className="mt-4 divide-y divide-navy/10 overflow-hidden rounded-2xl border border-navy/10 bg-cream">
              {RECENTLY_COVERED.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-saffron/20 text-saffron-dark">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="flex-1 text-sm font-medium text-navy">
                    {item.title}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-navy/40">
                    {item.subject}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
