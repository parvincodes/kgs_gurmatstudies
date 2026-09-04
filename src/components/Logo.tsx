export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="22" cy="22" r="21" fill="var(--color-navy)" />
      <circle
        cx="22"
        cy="22"
        r="16.5"
        stroke="var(--color-saffron)"
        strokeWidth="2.2"
        fill="none"
      />
      <text
        x="22"
        y="27.5"
        textAnchor="middle"
        fontFamily="var(--font-poppins), sans-serif"
        fontWeight="700"
        fontSize="13"
        fill="var(--color-cream)"
      >
        KGS
      </text>
    </svg>
  );
}
