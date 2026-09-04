import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  BookIcon,
  LandmarkIcon,
  LotusIcon,
  PotIcon,
  LeafIcon,
  GraduationIcon,
  MegaphoneIcon,
  HandshakeIcon,
  SearchIcon,
  ChartIcon,
  LockIcon,
} from "@/components/icons";

const PROGRAM = [
  {
    icon: BookIcon,
    title: "Gurbani",
    desc: "Japji Sahib and the importance of Nitnem — building a real understanding of the core messages that form the foundation of Sri Guru Granth Sahib Ji.",
  },
  {
    icon: LandmarkIcon,
    title: "History",
    desc: "The events of 1947 and 1984 — understanding the underlying issues, and what they mean for us today.",
  },
  {
    icon: LotusIcon,
    title: "Philosophy",
    desc: "Sikh philosophy explored through selected Shabads, alongside a comparative look at other religions.",
  },
];

const COMMUNITY = [
  {
    icon: PotIcon,
    title: "Langar Seva",
    desc: "Coming together to prepare Langar — targeting at least 3 sessions this year.",
  },
  {
    icon: LeafIcon,
    title: "Green Team",
    desc: "Student-led environmental seva. More hands are always welcome.",
  },
  {
    icon: GraduationIcon,
    title: "Gurmukhi Exam Mentorship",
    desc: "Senior students help younger groups prepare — building relationships across the sangat.",
  },
  {
    icon: MegaphoneIcon,
    title: "Sikh Advocacy Day",
    desc: "Feb 19, 2027 in Olympia — advocating for bills that matter to our community.",
  },
  {
    icon: HandshakeIcon,
    title: "Interfaith Youth Meeting",
    desc: "Joining the interfaith youth meeting this September to build bridges with other communities.",
  },
];

const PORTAL_FEATURES = [
  {
    icon: SearchIcon,
    title: "Searchable Study Materials",
    desc: "Find Gurbani translations, history readings, and philosophy notes in seconds.",
  },
  {
    icon: ChartIcon,
    title: "Progress Tracking",
    desc: "See what you've covered this year and what's coming up next.",
  },
  {
    icon: LockIcon,
    title: "Student & Teacher Login",
    desc: "A secure, whitelisted login so your class progress stays with you.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-navy text-cream">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-saffron/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-28">
            <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-saffron-light">
              Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh
            </p>
            <h1 className="font-heading mt-5 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
              Rooted in Gurbani.
              <br /> Growing in Community.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75">
              Khalsa Gurmat School is a learning community for students
              14&nbsp;and&nbsp;up — studying Gurbani, Sikh history, and
              philosophy together, and living it out through seva and
              service.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#program"
                className="rounded-full bg-saffron px-7 py-3 text-sm font-semibold text-navy-dark shadow-lg shadow-saffron/20 transition hover:bg-saffron-light"
              >
                Explore This Year&apos;s Program
              </a>
              <Link
                href="/login"
                className="rounded-full border border-cream/30 px-7 py-3 text-sm font-semibold text-cream transition hover:bg-cream/10"
              >
                Student &amp; Teacher Login
              </Link>
            </div>

            <dl className="mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-cream/15 pt-8">
              <div>
                <dt className="font-heading text-3xl font-bold text-saffron-light">3</dt>
                <dd className="mt-1 text-sm text-cream/60">Core subjects</dd>
              </div>
              <div>
                <dt className="font-heading text-3xl font-bold text-saffron-light">5</dt>
                <dd className="mt-1 text-sm text-cream/60">Community programs</dd>
              </div>
              <div>
                <dt className="font-heading text-3xl font-bold text-saffron-light">14+</dt>
                <dd className="mt-1 text-sm text-cream/60">Ages welcome</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Welcome note */}
        <section className="mx-auto max-w-4xl px-5 py-16 text-center">
          <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
            Welcome to the new session
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy/70">
            This year&apos;s topics were chosen by our students — they
            explored ideas, formed groups, and advocated for the subjects
            they were most passionate about. Beyond academics, we want
            students — and parents too — participating in our community
            activities. If you have suggestions or learnings from last
            year, we&apos;d genuinely love to hear them.
          </p>
        </section>

        {/* Program */}
        <section id="program" className="bg-cream-dark/60 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-xl">
              <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
                This Year&apos;s Program
              </p>
              <h2 className="font-heading mt-2 text-3xl font-bold text-navy">
                Three subjects, chosen by students
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PROGRAM.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-navy/10 bg-cream p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron/15 text-saffron-dark">
                    <Icon />
                  </div>
                  <h3 className="font-heading mt-5 text-lg font-bold text-navy">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/65">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community */}
        <section id="community" className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-xl">
              <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
                Community &amp; Seva
              </p>
              <h2 className="font-heading mt-2 text-3xl font-bold text-navy">
                Beyond the classroom
              </h2>
              <p className="mt-3 text-navy/65">
                We want students — and parents too — to take part in
                these community activities throughout the year.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {COMMUNITY.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-navy p-7 text-cream transition hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream/10 text-saffron-light">
                    <Icon />
                  </div>
                  <h3 className="font-heading mt-5 text-lg font-bold">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portal preview / coming soon */}
        <section id="portal" className="bg-cream-dark/60 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-xl">
              <p className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-dark">
                Coming Soon to the Portal
              </p>
              <h2 className="font-heading mt-2 text-3xl font-bold text-navy">
                Your study materials, all in one place
              </h2>
              <p className="mt-3 text-navy/65">
                We&apos;re building a student &amp; teacher portal so
                you can find materials fast and track your own progress
                through the year.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {PORTAL_FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="relative rounded-2xl border border-dashed border-navy/20 bg-cream p-7"
                >
                  <span className="absolute right-5 top-5 rounded-full bg-saffron/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-saffron-dark">
                    Soon
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy">
                    <Icon />
                  </div>
                  <h3 className="font-heading mt-5 text-lg font-bold text-navy">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/65">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="rounded-3xl bg-gradient-to-br from-saffron to-saffron-dark px-8 py-14 text-center text-navy-dark sm:px-16">
            <h2 className="font-heading text-3xl font-extrabold">
              Bring a friend to the next session
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-navy-dark/80">
              Open to all students 14 and up. Reach out and we&apos;ll get
              you connected with your class.
            </p>
            <a
              href="mailto:info@khalsagurmatschool.org"
              className="mt-8 inline-block rounded-full bg-navy px-8 py-3 text-sm font-semibold text-cream transition hover:bg-navy-light"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
