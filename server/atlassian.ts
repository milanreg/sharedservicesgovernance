import type {
  ActivityItem,
  ActivityList,
  ActivityWindow,
  ConfluenceDoc,
  LiveSnapshot,
  Ticket,
} from "../src/template/types";
import type { ProjectSyncConfig } from "./syncConfig";

export type Credentials = {
  jiraBaseUrl: string;
  /** Ready-to-send Authorization header: Basic for Cloud, Bearer for a PAT. */
  jiraAuth: string;
  confluenceBaseUrl?: string;
  confluenceToken?: string;
};

/** How far the delivery review looks back and forward. */
const WINDOW_DAYS = 30;
/** Open work untouched for this long is treated as stalled rather than active. */
const STALE_DAYS = 14;

export class SyncError extends Error {
  constructor(
    message: string,
    readonly status = 500,
  ) {
    super(message);
  }
}

function pick(env: Record<string, string | undefined>, ...names: string[]) {
  for (const name of names) {
    const value = env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

const trimSlash = (url: string) => url.replace(/\/$/, "");
const basic = (email: string, token: string) =>
  `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;

/**
 * A URL and a token only work together, so candidates are resolved as whole
 * sets rather than key by key. Cloud comes first: the dashboards link to Cloud
 * issues, and a credentials file shared with regnology-mcp also carries
 * Data Center values that would otherwise win on name alone.
 */
function readJira(env: Record<string, string | undefined>) {
  const cloudUrl = pick(env, "JIRA_CLOUD_BASE_URL", "JIRA_CLOUD_URL");
  const cloudEmail = pick(env, "JIRA_CLOUD_EMAIL");
  const cloudToken = pick(env, "JIRA_CLOUD_API_TOKEN");
  if (cloudUrl && cloudEmail && cloudToken) {
    return { jiraBaseUrl: trimSlash(cloudUrl), jiraAuth: basic(cloudEmail, cloudToken) };
  }

  const url = pick(env, "JIRA_BASE_URL", "JIRA_URL");
  const email = pick(env, "JIRA_EMAIL");
  const token = pick(env, "JIRA_API_TOKEN");
  if (url && email && token) {
    return { jiraBaseUrl: trimSlash(url), jiraAuth: basic(email, token) };
  }

  const pat = pick(env, "JIRA_PAT", "JIRA_PERSONAL_TOKEN");
  if (url && pat) {
    return { jiraBaseUrl: trimSlash(url), jiraAuth: `Bearer ${pat}` };
  }

  return undefined;
}

/** Reads credentials without ever echoing their values back to the caller. */
export function readCredentials(env: Record<string, string | undefined>): Credentials {
  const jira = readJira(env);
  if (!jira) {
    throw new SyncError(
      "Jira credentials are not configured. Set JIRA_CLOUD_BASE_URL, JIRA_CLOUD_EMAIL and JIRA_CLOUD_API_TOKEN (or the JIRA_BASE_URL / JIRA_EMAIL / JIRA_API_TOKEN equivalents) in .env, or point ENV_FILE at an existing credentials file — see .env.example.",
      412,
    );
  }

  const confluenceBaseUrl = pick(env, "CONFLUENCE_BASE_URL", "CONFLUENCE_URL");
  return {
    ...jira,
    confluenceBaseUrl: confluenceBaseUrl ? trimSlash(confluenceBaseUrl) : undefined,
    confluenceToken: pick(env, "CONFLUENCE_TOKEN", "CONFLUENCE_PAT"),
  };
}

/**
 * Node reports every transport problem as a bare "fetch failed", which reads as
 * a bug rather than "that host needs the VPN". Name the host instead.
 */
async function request(url: string, init: RequestInit) {
  try {
    return await fetch(url, init);
  } catch (error) {
    const host = new URL(url).host;
    const cause = (error as { cause?: { code?: string } }).cause?.code;
    const reason = cause === "UND_ERR_CONNECT_TIMEOUT" ? "timed out" : "could not be reached";
    throw new SyncError(
      `${host} ${reason}${cause ? ` (${cause})` : ""}. Check the URL, and the VPN if it is an internal host.`,
      502,
    );
  }
}

async function jira<T>(
  creds: Credentials,
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const response = await request(`${creds.jiraBaseUrl}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: creds.jiraAuth,
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
    priority?: { name: string } | null;
    closedSprints?: { id: number }[];
    resolutiondate?: string | null;
    created?: string;
    updated?: string;
    duedate?: string | null;
  };
};

async function search(
  creds: Credentials,
  jql: string,
  maxResults: number,
  extraFields: string[] = [],
): Promise<JiraIssue[]> {
  const fields = ["summary", "status", "assignee", ...extraFields];
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

  const today = new Date().setHours(0, 0, 0, 0);
  const horizon = today + WINDOW_DAYS * 86_400_000;
  const at = (v: Version) => new Date(v.releaseDate as string).getTime();
  const strip = (v: Version) => ({
    name: v.name,
    date: (v.releaseDate as string).slice(0, 10),
    released: false,
  });

  const pending = dated.filter((v) => !v.released).sort(byDate);
  const dueSoon = pending.filter((v) => at(v) >= today && at(v) <= horizon).map(strip);
  const overdue = pending.filter((v) => at(v) < today).map(strip);

  return {
    currentRelease: upcoming
      ? { name: upcoming.name, date: formatDate(upcoming.releaseDate), released: false }
      : undefined,
    lastRelease: shipped
      ? { name: shipped.name, date: formatDate(shipped.releaseDate) }
      : undefined,
    dueSoon,
    overdue,
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
        const response = await request(url, {
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

function toActivity(issue: JiraIssue, date?: string | null): ActivityItem {
  return {
    key: issue.key,
    summary: issue.fields.summary ?? "",
    status: issue.fields.status?.name ?? "Unknown",
    owner: issue.fields.assignee?.displayName ?? "Unassigned",
    date: date ? date.slice(0, 10) : "",
    priority: issue.fields.priority?.name,
  };
}

/** Enough rows to read the shape of the window without bloating the snapshot. */
const SAMPLE = 25;

/**
 * The count comes from Jira rather than the sample length, so a window with
 * more items than the cap still reports the truth. One failed list degrades to
 * a warning instead of costing the whole review.
 */
async function activityList(
  creds: Credentials,
  jql: string,
  order: string,
  field: keyof JiraIssue["fields"],
  label: string,
  warnings: string[],
): Promise<ActivityList> {
  try {
    const [total, issues] = await Promise.all([
      count(creds, jql),
      search(creds, `${jql} ORDER BY ${order}`, SAMPLE, [field as string, "priority"]),
    ]);
    return {
      total,
      items: issues.map((issue) =>
        toActivity(issue, issue.fields[field] as string | null | undefined),
      ),
    };
  } catch (error) {
    warnings.push(`${label} could not be read: ${(error as Error).message}`);
    return { total: 0, items: [] };
  }
}

type VersionRef = { name: string; date: string; released: boolean };

async function readActivity(
  creds: Credentials,
  scope: string,
  releases: VersionRef[],
  overdueReleases: VersionRef[],
  warnings: string[],
): Promise<ActivityWindow> {
  const open = `${scope} AND statusCategory != Done`;
  const [delivered, raised, due, stalled] = await Promise.all([
    activityList(
      creds,
      `${scope} AND resolved >= -${WINDOW_DAYS}d`,
      "resolved DESC",
      "resolutiondate",
      "Recently delivered",
      warnings,
    ),
    activityList(
      creds,
      `${scope} AND created >= -${WINDOW_DAYS}d`,
      "created DESC",
      "created",
      "Recently raised",
      warnings,
    ),
    activityList(
      creds,
      `${open} AND duedate >= startOfDay() AND duedate <= ${WINDOW_DAYS}d`,
      "duedate ASC",
      "duedate",
      "Work due in the next 30 days",
      warnings,
    ),
    activityList(
      creds,
      `${open} AND updated <= -${STALE_DAYS}d`,
      "updated ASC",
      "updated",
      "Stalled work",
      warnings,
    ),
  ]);

  return { days: WINDOW_DAYS, delivered, raised, due, stalled, releases, overdueReleases };
}

/**
 * Proves the exclusion is valid JQL before every later query depends on it —
 * an unknown issue type would otherwise fail the whole sync.
 */
async function resolveScope(
  creds: Credentials,
  config: ProjectSyncConfig,
  warnings: string[],
): Promise<string> {
  if (!config.excludeJql) return config.scopeJql;

  const scope = `(${config.scopeJql}) AND (${config.excludeJql})`;
  try {
    await count(creds, scope);
    return scope;
  } catch (error) {
    warnings.push(
      `Scope exclusion was ignored (${(error as Error).message}); counts include everything matching the project scope.`,
    );
    return config.scopeJql;
  }
}

export async function buildSnapshot(
  slug: string,
  config: ProjectSyncConfig,
  creds: Credentials,
): Promise<LiveSnapshot> {
  const warnings: string[] = [];
  const scope = await resolveScope(creds, config, warnings);

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

  const { dueSoon, overdue, ...releases } = await readReleases(creds, config.jiraProjectKey).catch(
    (error: Error) => {
      warnings.push(`Releases could not be read: ${error.message}`);
      return { currentRelease: undefined, lastRelease: undefined, dueSoon: [], overdue: [] };
    },
  );

  const sprintData = config.boardId
    ? await readSprint(creds, config.boardId, warnings)
    : { sprint: undefined, tickets: [] as Ticket[] };

  if (!sprintData.tickets.length && !config.boardId) {
    const issues = await search(creds, `${openScope} ORDER BY updated DESC`, 50);
    sprintData.tickets = issues.map(toTicket);
  }

  const activity = await readActivity(creds, scope, dueSoon, overdue, warnings);
  const confluence = await readConfluence(creds, config.confluencePageIds ?? [], warnings);

  return {
    slug,
    syncedAt: new Date().toISOString(),
    projectSummary: { done, open, highPriorityOpen, unassignedOpen, epics, ...releases },
    sprint: sprintData.sprint,
    tickets: sprintData.tickets,
    activity,
    confluence,
    warnings,
  };
}
