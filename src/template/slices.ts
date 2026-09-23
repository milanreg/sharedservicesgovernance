import type { ProjectGovernance, Ticket, TicketCardId } from "./types";
import { workflowTone } from "./status";

export type SprintSlice = "committed" | "done" | "wip" | "integration" | "attention";

export function isSprintSlice(value: string | null): value is SprintSlice {
  return (
    value === "committed" ||
    value === "done" ||
    value === "wip" ||
    value === "integration" ||
    value === "attention"
  );
}

/** Development is finished but the change is not in a release yet. */
function awaitingIntegration(status: string): boolean {
  return /ready for integration/i.test(status);
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
  // Counted apart from work in flight: a queue here is a release risk, not progress.
  const integration = tickets.filter((t) => !t.blocked && awaitingIntegration(t.status));
  const waiting = tickets.filter(
    (t) =>
      !t.blocked &&
      t.status !== "Closed" &&
      t.status !== "In Implementation" &&
      t.status !== "In Quality Review" &&
      !awaitingIntegration(t.status),
  );
  return { committed: tickets, done, wip, integration, attention, waiting };
}

function byKey(tickets: Ticket[]) {
  const seen = new Map<string, Ticket>();
  for (const ticket of tickets) seen.set(ticket.key, ticket);
  return [...seen.values()];
}

/** Counts and lists behind the four stakeholder cards on every project board. */
export function stakeholderCards(project: ProjectGovernance): Record<
  TicketCardId,
  { total: number; tickets: Ticket[] }
> {
  const sprint = project.tickets;
  const backlog = (project.backlogTickets?.length
    ? project.backlogTickets
    : sprint.filter((ticket) => workflowTone(ticket.status) !== "green"));
  const spillover = sprint.filter((ticket) => ticket.spillover);
  const attention = byKey([
    ...sprint.filter(
      (ticket) => ticket.blocked || workflowTone(ticket.status, { blocked: ticket.blocked }) === "red",
    ),
    ...backlog.filter(
      (ticket) => ticket.blocked || workflowTone(ticket.status, { blocked: ticket.blocked }) === "red",
    ),
  ]);

  return {
    backlog: {
      total: project.projectSummary.open || backlog.length,
      tickets: backlog,
    },
    sprint: { total: sprint.length, tickets: sprint },
    spillover: { total: spillover.length, tickets: spillover },
    attention: { total: attention.length, tickets: attention },
  };
}
