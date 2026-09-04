"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "#program", label: "This Year's Program" },
  { href: "#community", label: "Community & Seva" },
  { href: "#portal", label: "Student Portal" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="font-heading text-lg font-bold leading-tight text-navy">
            Khalsa Gurmat School
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy/80 transition hover:text-saffron-dark"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-cream transition hover:bg-navy-light"
          >
            Student &amp; Teacher Login
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-navy md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-navy/10 bg-cream px-5 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-navy/80 hover:bg-navy/5"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-navy px-5 py-2.5 text-center text-sm font-semibold text-cream"
          >
            Student &amp; Teacher Login
          </Link>
        </nav>
      )}
    </header>
  );
}
