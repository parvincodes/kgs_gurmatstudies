import type { MaterialStatus } from "@/lib/materials-db";

const STYLES: Record<MaterialStatus, string> = {
  pending: "bg-navy/10 text-navy/60",
  approved: "bg-green-100 text-green-700",
  flagged: "bg-red-100 text-red-700",
};

const LABELS: Record<MaterialStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  flagged: "Flagged",
};

export default function StatusBadge({ status }: { status: MaterialStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
