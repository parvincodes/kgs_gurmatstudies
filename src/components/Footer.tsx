import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="contact" className="bg-navy text-cream/80">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={36} />
              <span className="font-heading text-base font-bold text-cream">
                Khalsa Gurmat School
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh. A learning
              community for students 14+ built on Gurbani, history, and
              seva.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-light">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="/materials" className="hover:text-cream">
                  Study Materials
                </a>
              </li>
              <li>
                <a href="/progress" className="hover:text-cream">
                  Progress Tracking (Preview)
                </a>
              </li>
              <li>
                <a href="/#program" className="hover:text-cream">
                  This Year&apos;s Program
                </a>
              </li>
              <li>
                <a href="/#community" className="hover:text-cream">
                  Community &amp; Seva
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-cream">
                  Student &amp; Teacher Login
                </a>
              </li>
              <li>
                <a href="/upload" className="hover:text-cream">
                  Teacher Upload
                </a>
              </li>
              <li>
                <a href="/review" className="hover:text-cream">
                  Review Materials
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-saffron-light">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:info@khalsagurmatschool.org"
                  className="hover:text-cream"
                >
                  info@khalsagurmatschool.org
                </a>
              </li>
              <li className="text-cream/60">
                Have suggestions from last year? We&apos;d love to hear
                them.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Khalsa Gurmat School. Made with seva.</p>
          <p>Site under active development — new features coming soon.</p>
        </div>
      </div>
    </footer>
  );
}
