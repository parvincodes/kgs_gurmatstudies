export default function PreviewBanner({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-saffron/30 bg-saffron/10 px-5 py-4 text-sm text-navy/75">
      <span className="mt-0.5 rounded-full bg-saffron px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-navy-dark">
        Preview
      </span>
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}
