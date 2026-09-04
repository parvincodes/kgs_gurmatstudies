import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LockIcon } from "@/components/icons";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-5 py-24">
        <div className="w-full max-w-md rounded-3xl border border-navy/10 bg-cream-dark/40 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/5 text-navy">
            <LockIcon />
          </div>
          <h1 className="font-heading mt-6 text-2xl font-bold text-navy">
            Login is coming soon
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-navy/65">
            We&apos;re building secure, whitelisted login for students and
            teachers so you can track your progress and access study
            materials. Check back soon, or reach out if you&apos;d like
            to be added to the list early.
          </p>
          <a
            href="mailto:info@khalsagurmatschool.org"
            className="mt-8 inline-block rounded-full bg-navy px-7 py-3 text-sm font-semibold text-cream transition hover:bg-navy-light"
          >
            Get Notified
          </a>
          <div className="mt-6">
            <Link href="/" className="text-sm font-medium text-saffron-dark hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
