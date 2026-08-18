import type { ActivityList, Bottleneck, GanttItem, ProjectGovernance, Ticket } from "./types";

const DAY = 86_400_000;
const DEFAULT_DAYS = 30;

export type Milestone = {
  item: GanttItem;
  kind: "starts" | "ends";
  date: string;
};

export type Digest = {
  days: number;
  from: Date;
  to: Date;
  /** False when Jira has never been synced, so the dialog can say so. */
  live: boolean;
  delivered: ActivityList;
  raised: ActivityList;
  due: ActivityList;
  stalled: ActivityList;
  releases: { name: string; date: string; released: boolean }[];
  overdueReleases: { name: string; date: string; released: boolean }[];
  milestones: Milestone[];
  blocked: Ticket[];
  inFlight: Ticket[];
  bottlenecks: Bottleneck[];
  sprintEndsInWindow: boolean;
};

export function formatDay(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function within(value: string, from: Date, to: Date): boolean {
  const time = new Date(value).getTime();
  return !Number.isNaN(time) && time >= from.getTime() && time <= to.getTime();
}

/**
 * Jira only knows the parts of a review it can measure. Authored roadmap bars
 * and bottlenecks fill in the intent behind the numbers, so the digest merges
 * both rather than reporting whichever happens to be present.
 */
export function buildDigest(project: ProjectGovernance, now = new Date()): Digest {
  const activity = project.activity;
  const days = activity?.days ?? DEFAULT_DAYS;
  const from = new Date(now.getTime() - days * DAY);
  const to = new Date(now.getTime() + days * DAY);

  const milestones = [...project.backlogGantt.items, ...project.stakeholderGantt.items]
    .flatMap<Milestone>((item) => {
      const hits: Milestone[] = [];
      if (within(item.end, now, to)) hits.push({ item, kind: "ends", date: item.end });
      if (within(item.start, now, to)) hits.push({ item, kind: "starts", date: item.start });
      return hits;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const fallback = project.previousSprint.closed.map((ticket) => ({
    key: ticket.key,
    summary: ticket.summary,
    status: ticket.status,
    owner: ticket.owner,
    date: "",
  }));
  const empty: ActivityList = { total: 0, items: [] };

  const sprintEnd = new Date(project.sprint.end);

  return {
    days,
    from,
    to,
    live: Boolean(activity),
    delivered: activity?.delivered ?? { total: fallback.length, items: fallback },
    raised: activity?.raised ?? empty,
    due: activity?.due ?? empty,
    stalled: activity?.stalled ?? empty,
    releases: activity?.releases ?? [],
    overdueReleases: activity?.overdueReleases ?? [],
    milestones,
    blocked: project.tickets.filter((ticket) => ticket.blocked || ticket.risk?.level === "red"),
    inFlight: project.tickets.filter((ticket) =>
      /implementation|review|progress/i.test(ticket.status),
    ),
    bottlenecks: project.bottlenecks,
    sprintEndsInWindow: !Number.isNaN(sprintEnd.getTime()) && sprintEnd <= to,
  };
}
