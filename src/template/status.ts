import type { Rag } from "./types";

/** Green = done, Amber = at risk / waiting, Red = blocked or critical, Other = in-flight or new. */
export type StatusTone = "green" | "amber" | "red" | "other";

export type OtherHue = "blue" | "slate" | "teal";

export function workflowTone(
  status: string,
  flags?: { blocked?: boolean },
): StatusTone {
  if (flags?.blocked) return "red";
  const s = status.toLowerCase();
  if (s.includes("blocked")) return "red";
  if (
    s === "closed" ||
    s === "done" ||
    s === "po accepted" ||
    s.startsWith("closed")
  ) {
    return "green";
  }
  if (s === "ready" || s === "in quality review") return "amber";
  return "other";
}

export function otherHue(status: string): OtherHue {
  const s = status.toLowerCase();
  if (s.includes("implementation") || s.includes("progress")) return "blue";
  if (s.includes("integration")) return "teal";
  return "slate";
}

export function ragTone(rag: Rag): StatusTone {
  if (rag === "Green") return "green";
  if (rag === "Red") return "red";
  if (rag === "Amber") return "amber";
  return "other";
}

export function statusLabel(status: string, flags?: { blocked?: boolean; spillover?: boolean }) {
  const parts = [flags?.blocked ? `${status} · Blocked` : status];
  if (flags?.spillover) parts.push("spillover");
  return parts.join(" · ");
}
