import type { Ticket } from "./types";
import { workflowTone } from "./status";

export type SprintSlice = "committed" | "done" | "wip" | "attention";

export function isSprintSlice(value: string | null): value is SprintSlice {
  return value === "committed" || value === "done" || value === "wip" || value === "attention";
}

export function sprintSlices(tickets: Ticket[]) {
  const done = tickets.filter((t) => workflowTone(t.status) === "green");
  const attention = tickets.filter(
    (t) => t.blocked || workflowTone(t.status, { blocked: t.blocked }) === "red",
  );
  const wip = tickets.filter(
    (t) =>
      !t.blocked &&
      (t.status === "In Implementation" || t.status === "In Quality Review"),
  );
  const waiting = tickets.filter(
    (t) =>
      !t.blocked &&
      t.status !== "Closed" &&
      t.status !== "In Implementation" &&
      t.status !== "In Quality Review",
  );
  return { committed: tickets, done, wip, attention, waiting };
}
