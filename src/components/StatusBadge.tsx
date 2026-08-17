import { otherHue, workflowTone, type StatusTone } from "../template/status";

export function StatusBadge({
  status,
  blocked,
  spillover,
}: {
  status: string;
  blocked?: boolean;
  spillover?: boolean;
}) {
  const tone: StatusTone = workflowTone(status, { blocked });
  const hue = tone === "other" ? otherHue(status) : undefined;
  const label = [blocked ? `${status} · Blocked` : status, spillover ? "spillover" : ""]
    .filter(Boolean)
    .join(" · ");

  return (
    <span className={`status-badge ${tone}${hue ? ` hue-${hue}` : ""}`}>
      <i />
      {label}
    </span>
  );
}
