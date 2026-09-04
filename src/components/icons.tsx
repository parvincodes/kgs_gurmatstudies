type IconProps = { className?: string };

const base = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BookIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5c-.8 0-1.5-.7-1.5-1.5v-13z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5v-13z" />
      <path d="M12 4v16" />
    </svg>
  );
}

export function LandmarkIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 21h18" />
      <path d="M4 21V10M9 21V10M15 21V10M20 21V10" />
      <path d="M2 10l10-6 10 6" />
      <path d="M3 10h18" />
    </svg>
  );
}

export function LotusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3c1.5 3 1.5 6.5 0 9-1.5-2.5-1.5-6 0-9z" />
      <path d="M5 9c3 .3 5.5 2 7 5-3 .5-5.8-.8-7-5z" />
      <path d="M19 9c-3 .3-5.5 2-7 5 3 .5 5.8-.8 7-5z" />
      <path d="M12 12c3 1.5 4.5 4 4.5 7H7.5c0-3 1.5-5.5 4.5-7z" />
      <path d="M3 19h18" />
    </svg>
  );
}

export function PotIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 10h16l-1.5 8.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 10z" />
      <path d="M2 10h20" />
      <path d="M8 10c0-3 1.5-5 4-6 2.5 1 4 3 4 6" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 20c-1-6 1.5-13 14-15 1 8-3.5 14-14 15z" />
      <path d="M6 19c3-4 6-7 12-14" />
    </svg>
  );
}

export function GraduationIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 8l10-4 10 4-10 4-10-4z" />
      <path d="M6 10.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-5.5" />
      <path d="M22 8v6" />
    </svg>
  );
}

export function MegaphoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l9 5V5L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M18 9.5c1.2.8 1.2 4.2 0 5" />
    </svg>
  );
}

export function HandshakeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 12l5-4 4 2 3-2 5 3" />
      <path d="M7 8l6 6 3-3" />
      <path d="M16 8l3 3-4 4-2.5-1.5" />
      <path d="M2 12l3 4 2-1" />
      <path d="M22 11l-3 4-1.5-.8" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
      <path d="M2 20h20" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}
