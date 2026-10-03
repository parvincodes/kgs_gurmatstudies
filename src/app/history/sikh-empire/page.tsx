import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LifespansChart from "@/components/history/LifespansChart";
import EventTimeline from "@/components/history/EventTimeline";
import { PERSON_GROUPS, formatLifeYears } from "@/lib/sikh-empire-chronology";

export const metadata: Metadata = {
  title: "Sikh Empire: A Chronology · Khalsa Gurmat School",
  description:
    "From the misls to annexation, c. 1700–1860: who lived when, and what happened when, in the rise and fall of Maharaja Ranjit Singh's empire.",
};

const SECTIONS = [
  { href: "#lifespans", label: "Lifespans" },
  { href: "#chronology", label: "Event chronology" },
  { href: "#wrong-role", label: "Who played the wrong role" },
  { href: "#sources", label: "Sources" },
];

const WRONG_ROLE = [
  {
    who: "Dhian Singh Dogra",
    what: "Kingmaker after 1839; behind the murder of Chet Singh Bajwa.",
  },
  {
    who: "Gulab Singh Dogra",
    what: "Built his own power in Jammu, stayed out of the first war, and bought Kashmir from the British.",
  },
  {
    who: "Lal Singh",
    what: "Wazir who corresponded with British officers during the first war.",
  },
  {
    who: "Tej Singh",
    what: "Commander-in-chief who withdrew at Ferozeshah and fled Sobraon.",
  },
  {
    who: "The Sandhanwalia sardars",
    what: "Assassinated Maharaja Sher Singh, his son and Dhian Singh on one day in 1843.",
  },
  {
    who: "Hira Singh and Pandit Jalla",
    what: "Their troops attacked Baba Bir Singh's dera in 1844.",
  },
];

function SectionHead({ id, title, children }: { id: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      <h2 id={id} className="font-heading scroll-mt-24 text-2xl font-bold text-navy sm:text-3xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-navy/65">{children}</p>}
    </div>
  );
}

export default function SikhEmpireChronologyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="max-w-2xl">
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
              <Link href="/#program" className="hover:underline">
                History
              </Link>
            </p>
            <h1 className="font-heading mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Sikh Empire: A Chronology
            </h1>
            <p className="mt-3 text-lg text-navy/65">
              From the misls to annexation, c. 1700–1860.
            </p>
            <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="rounded-full bg-navy/5 px-4 py-2 text-sm font-medium text-navy/70 transition hover:bg-navy/10"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>

          <section aria-labelledby="lifespans" className="mt-16">
            <SectionHead id="lifespans" title="Lifespans">
              Each bar runs from a person&apos;s birth to their death, so you can see who
              was alive together. Point at a bar, or tap a name, to read that
              person&apos;s role.
            </SectionHead>
            <div className="mt-6">
              <LifespansChart />
            </div>

            <details className="mt-4">
              <summary className="w-max max-w-full cursor-pointer py-2 text-sm font-medium text-saffron-dark">
                Read every role note as a table
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    People shown in the chart, with years and role notes
                  </caption>
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-navy/50">
                      <th scope="col" className="py-2 pr-4 font-semibold">Name</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Years</th>
                      <th scope="col" className="py-2 font-semibold">Role</th>
                    </tr>
                  </thead>
                  {PERSON_GROUPS.map((group) => (
                    <tbody key={group.name}>
                      <tr>
                        <th
                          colSpan={3}
                          scope="rowgroup"
                          className="font-heading pb-1 pt-5 text-base font-bold text-navy"
                        >
                          {group.name}
                        </th>
                      </tr>
                      {group.people.map((p) => (
                        <tr key={p.name} className="border-t border-navy/10 align-top">
                          <td className="py-2 pr-4 font-medium text-navy">{p.name}</td>
                          <td className="whitespace-nowrap py-2 pr-4 tabular-nums text-navy/65">
                            {formatLifeYears(p)}
                          </td>
                          <td className="py-2 text-navy/65">{p.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  ))}
                </table>
              </div>
            </details>
          </section>

          <section aria-labelledby="chronology" className="mt-20">
            <SectionHead id="chronology" title="Event chronology">
              Events are grouped into phases. Filter by category, search the text, or
              select a phase heading to fold it away.
            </SectionHead>
            <div className="mt-6">
              <EventTimeline />
            </div>
          </section>

          <section
            aria-labelledby="wrong-role"
            className="mt-20 rounded-2xl border border-navy/10 bg-cream-dark/60 p-6 sm:p-9"
          >
            <SectionHead id="wrong-role" title="Who played the wrong role" />
            <dl className="mt-5 border-b border-navy/10">
              {WRONG_ROLE.map(({ who, what }) => (
                <div
                  key={who}
                  className="grid gap-x-6 gap-y-0.5 border-t border-navy/10 py-3 sm:grid-cols-[15rem_minmax(0,1fr)]"
                >
                  <dt className="font-heading font-bold text-navy">{who}</dt>
                  <dd className="text-sm leading-relaxed text-navy/70">{what}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 max-w-2xl font-medium leading-relaxed text-navy">
              The betrayal was by individuals, not communities. Fakir Azizuddin, Diwan
              Mohkam Chand and Misr Diwan Chand served the state loyally.
            </p>
          </section>

          <section aria-labelledby="sources" className="mt-16 border-t border-navy/10 pt-6">
            <h2
              id="sources"
              className="font-heading scroll-mt-24 text-sm font-semibold uppercase tracking-wide text-saffron-dark"
            >
              Sources
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-navy/65">
              Compiled from the standard accounts of the period, chiefly Dr. Ganda
              Singh&apos;s work on the Anglo-Sikh wars, Dr. Sangat Singh&apos;s{" "}
              <cite>The Sikhs in History</cite> and Bhai Kahn Singh Nabha&apos;s{" "}
              <cite>Mahan Kosh</cite>. Items tagged &lsquo;disputed&rsquo; are dated or
              interpreted differently by different historians. This page is a study
              aid and has not been checked page by page against these works.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
