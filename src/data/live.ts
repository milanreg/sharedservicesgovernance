import type { LiveSnapshot, ProjectGovernance, Risk, Ticket } from "../template/types";

/**
 * Snapshots written by a previous sync are committed alongside the code, so a
 * reload keeps the refreshed numbers without needing credentials again.
 */
const bundled = import.meta.glob<{ default: LiveSnapshot }>("./live/*.json", { eager: true });

export function bundledSnapshot(slug: string): LiveSnapshot | undefined {
  return bundled[`./live/${slug}.json`]?.default;
}

export function formatSyncedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Overlays Jira and Confluence facts onto the hand-authored payload. Narrative,
 * architecture, roadmap, RACI, and RICE are judgement calls and stay untouched;
 * only counts, statuses, owners, dates, and document versions are replaced.
 */
export function applyLive(
  project: ProjectGovernance,
  snapshot: LiveSnapshot,
  risks: Record<string, Risk> = {},
): ProjectGovernance {
  const authored = new Map(project.tickets.map((t) => [t.key, t]));

  const tickets: Ticket[] = snapshot.tickets.map((live) => {
    const previous = authored.get(live.key);
    return {
      ...live,
      why: previous?.why,
      spillover: live.spillover ?? previous?.spillover,
      risk: risks[live.key],
    };
  });

  return {
    ...project,
    populated: project.populated || tickets.length > 0,
    lastSynced: snapshot.syncedAt,
    confluenceDocs: snapshot.confluence.length ? snapshot.confluence : project.confluenceDocs,
    activity: snapshot.activity ?? project.activity,
    snapshot: formatSyncedAt(snapshot.syncedAt),
    tickets: tickets.length ? tickets : project.tickets,
    sprint: snapshot.sprint ? { ...project.sprint, ...snapshot.sprint } : project.sprint,
    projectSummary: { ...project.projectSummary, ...snapshot.projectSummary },
  };
}
