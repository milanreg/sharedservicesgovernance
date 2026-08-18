import type { ConfluenceDoc, LiveSnapshot, Ticket } from "../src/template/types";
import type { ProjectSyncConfig } from "./syncConfig";

export type Credentials = {
  jiraBaseUrl: string;
  jiraEmail: string;
  jiraToken: string;
  confluenceBaseUrl?: string;
  confluenceToken?: string;
};

export class SyncError extends Error {
  constructor(
    message: string,
    readonly status = 500,
  ) {
    super(message);
  }
}

/** Reads credentials without ever echoing their values back to the caller. */
export function readCredentials(env: Record<string, string | undefined>): Credentials {
  const missing = ["JIRA_BASE_URL", "JIRA_EMAIL", "JIRA_API_TOKEN"].filter((key) => !env[key]);
  if (missing.length) {
    throw new SyncError(
      `Jira credentials are not configured. Add ${missing.join(", ")} to .env — see .env.example.`,
      412,
    );
  }
  return {
    jiraBaseUrl: (env.JIRA_BASE_URL as string).replace(/\/$/, ""),
    jiraEmail: env.JIRA_EMAIL as string,
    jiraToken: env.JIRA_API_TOKEN as string,
    confluenceBaseUrl: env.CONFLUENCE_BASE_URL?.replace(/\/$/, ""),
    confluenceToken: env.CONFLUENCE_TOKEN,
  };
}

async function jira<T>(
  creds: Credentials,
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const auth = Buffer.from(`${creds.jiraEmail}:${creds.jiraToken}`).toString("base64");
  const response = await fetch(`${creds.jiraBaseUrl}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new SyncError(`Jira ${response.status} on ${path}: ${detail}`, response.status);
  }
  return (await response.json()) as T;
}

/**
 * Cloud replaced the old GET /search with POST /search/jql and a dedicated
 * count endpoint. Fall back to the v2 search so this also works against
 * older Data Center instances.
 */
async function count(creds: Credentials, jql: string): Promise<number> {
  try {
    const result = await jira<{ count: number }>(creds, "/rest/api/3/search/approximate-count", {
      method: "POST",
      body: { jql },
    });
    return result.count;
  } catch (error) {
    if (error instanceof SyncError && error.status !== 404 && error.status !== 410) throw error;
    const result = await jira<{ total: number }>(
      creds,
      `/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=0`,
    );
    return result.total;
  }
}

type JiraIssue = {
  key: string;
  fields: {
    summary: string;
    status?: { name: string };
    assignee?: { displayName: string } | null;
    closedSprints?: { id: number }[];
  };
};

async function search(creds: Credentials, jql: string, maxResults: number): Promise<JiraIssue[]> {
  const fields = ["summary", "status", "assignee"];
  try {
    const result = await jira<{ issues: JiraIssue[] }>(creds, "/rest/api/3/search/jql", {
      method: "POST",
      body: { jql, maxResults, fields },
    });
    return result.issues ?? [];
  } catch (error) {
    if (error instanceof SyncError && error.status !== 404 && error.status !== 410) throw error;
    const query = `jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&fields=${fields.join(",")}`;
    const result = await jira<{ issues: JiraIssue[] }>(creds, `/rest/api/2/search?${query}`);
    return result.issues ?? [];
  }
}

function toTicket(issue: JiraIssue): Ticket {
  const status = issue.fields.status?.name ?? "Unknown";
  const summary = issue.fields.summary ?? "";
  return {
    key: issue.key,
    summary,
    status,
    owner: issue.fields.assignee?.displayName ?? "Unassigned",
    blocked: /blocked/i.test(status) || /\[blocked\]/i.test(summary),
    spillover: (issue.fields.closedSprints?.length ?? 0) > 0,
  };
}

function formatDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

async function readSprint(creds: Credentials, boardId: number, warnings: string[]) {
  type Sprint = { id: number; name: string; startDate?: string; endDate?: string };
  const sprints = await jira<{ values: Sprint[] }>(
    creds,
    `/rest/agile/1.0/board/${boardId}/sprint?state=active`,
  );
  const active = sprints.values?.[0];
  if (!active) {
    warnings.push(`No active sprint on board ${boardId}.`);
    return { sprint: undefined, tickets: [] as Ticket[] };
  }

  const issues = await jira<{ issues: JiraIssue[] }>(
    creds,
    `/rest/agile/1.0/sprint/${active.id}/issue?maxResults=200&fields=summary,status,assignee,closedSprints`,
  );
  const tickets = (issues.issues ?? []).map(toTicket);
  const isDone = (t: Ticket) => /closed|done|accepted/i.test(t.status);
  const inFlight = (t: Ticket) => /implementation|review|progress/i.test(t.status);

  return {
    sprint: {
      name: active.name,
      start: formatDate(active.startDate),
      end: formatDate(active.endDate),
      committed: tickets.length,
      done: tickets.filter(isDone).length,
      inProgress: tickets.filter(inFlight).length,
      blocked: tickets.filter((t) => t.blocked).length,
    },
    tickets,
  };
}

async function readReleases(creds: Credentials, projectKey: string) {
  type Version = { name: string; releaseDate?: string; released: boolean; archived: boolean };
  const versions = await jira<Version[]>(creds, `/rest/api/3/project/${projectKey}/versions`);
  const dated = versions.filter((v) => !v.archived && v.releaseDate);
  const byDate = (a: Version, b: Version) =>
    new Date(a.releaseDate as string).getTime() - new Date(b.releaseDate as string).getTime();

  const upcoming = dated.filter((v) => !v.released).sort(byDate)[0];
  const shipped = dated.filter((v) => v.released).sort(byDate).at(-1);

  return {
    currentRelease: upcoming
      ? { name: upcoming.name, date: formatDate(upcoming.releaseDate), released: false }
      : undefined,
    lastRelease: shipped
      ? { name: shipped.name, date: formatDate(shipped.releaseDate) }
      : undefined,
  };
}

async function readConfluence(
  creds: Credentials,
  pageIds: string[],
  warnings: string[],
): Promise<ConfluenceDoc[]> {
  if (!creds.confluenceBaseUrl || !creds.confluenceToken) {
    warnings.push("Confluence is not configured; page versions were not refreshed.");
    return [];
  }

  const docs = await Promise.all(
    pageIds.map(async (id): Promise<ConfluenceDoc | undefined> => {
      const url = `${creds.confluenceBaseUrl}/rest/api/content/${id}?expand=version`;
      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${creds.confluenceToken}`, Accept: "application/json" },
        });
        if (!response.ok) {
          warnings.push(`Confluence ${response.status} for page ${id}.`);
          return undefined;
        }
        const page = (await response.json()) as {
          title: string;
          version?: { number: number; when: string };
        };
        return {
          title: page.title,
          version: page.version?.number ?? null,
          updated: formatDate(page.version?.when),
          url: `${creds.confluenceBaseUrl}/pages/viewpage.action?pageId=${id}`,
        };
      } catch (error) {
        warnings.push(`Confluence page ${id} unreachable: ${(error as Error).message}`);
        return undefined;
      }
    }),
  );

  return docs.filter((doc): doc is ConfluenceDoc => Boolean(doc));
}

export async function buildSnapshot(
  slug: string,
  config: ProjectSyncConfig,
  creds: Credentials,
): Promise<LiveSnapshot> {
  const warnings: string[] = [];
  const scope = config.scopeJql;

  const openScope = `${scope} AND statusCategory != Done`;
  const [done, open, unassignedOpen, epics] = await Promise.all([
    count(creds, `${scope} AND statusCategory = Done`),
    count(creds, openScope),
    count(creds, `${openScope} AND assignee IS EMPTY`),
    count(creds, `${scope} AND issuetype = Epic`),
  ]);

  let highPriorityOpen = 0;
  try {
    highPriorityOpen = await count(creds, `${openScope} AND priority in (Highest, High, Critical)`);
  } catch {
    try {
      highPriorityOpen = await count(creds, `${openScope} AND priority in (Highest, High)`);
      warnings.push("Priority 'Critical' is not in this project's scheme; counted Highest and High.");
    } catch {
      warnings.push("High-priority count could not be read.");
    }
  }

  const releases = await readReleases(creds, config.jiraProjectKey).catch((error: Error) => {
    warnings.push(`Releases could not be read: ${error.message}`);
    return { currentRelease: undefined, lastRelease: undefined };
  });

  const sprintData = config.boardId
    ? await readSprint(creds, config.boardId, warnings)
    : { sprint: undefined, tickets: [] as Ticket[] };

  if (!sprintData.tickets.length && !config.boardId) {
    const issues = await search(creds, `${openScope} ORDER BY updated DESC`, 50);
    sprintData.tickets = issues.map(toTicket);
  }

  const confluence = await readConfluence(creds, config.confluencePageIds ?? [], warnings);

  return {
    slug,
    syncedAt: new Date().toISOString(),
    projectSummary: { done, open, highPriorityOpen, unassignedOpen, epics, ...releases },
    sprint: sprintData.sprint,
    tickets: sprintData.tickets,
    confluence,
    warnings,
  };
}
