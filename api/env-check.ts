/**
 * Temporary diagnostic for the deployed sync returning 412.
 *
 * It answers the only question the 412 leaves open: can the function actually
 * see the credential variables? It reports names, lengths and which credential
 * set would win — never a value, and never enough of one to be useful to a
 * reader. Delete this file once the sync is green.
 */
const JIRA_NAMES = [
  "JIRA_CLOUD_BASE_URL",
  "JIRA_CLOUD_URL",
  "JIRA_CLOUD_EMAIL",
  "JIRA_CLOUD_API_TOKEN",
  "JIRA_BASE_URL",
  "JIRA_URL",
  "JIRA_EMAIL",
  "JIRA_API_TOKEN",
  "JIRA_PAT",
  "JIRA_PERSONAL_TOKEN",
];

const CONFLUENCE_NAMES = [
  "CONFLUENCE_BASE_URL",
  "CONFLUENCE_URL",
  "CONFLUENCE_TOKEN",
  "CONFLUENCE_PAT",
];

export default {
  async fetch(): Promise<Response> {
    const env = process.env;

    // Whitespace and stray quotes survive a dashboard paste and break auth in
    // ways that look identical to "not set", so both are called out.
    const describe = (name: string) => {
      const raw = env[name];
      if (raw === undefined) return { set: false };
      return {
        set: raw.trim().length > 0,
        length: raw.length,
        padded: raw !== raw.trim() || undefined,
        quoted: /^["'].*["']$/.test(raw.trim()) || undefined,
      };
    };

    const has = (name: string) => Boolean(env[name]?.trim());
    const jiraSet = has("JIRA_CLOUD_BASE_URL") && has("JIRA_CLOUD_EMAIL") && has("JIRA_CLOUD_API_TOKEN")
      ? "cloud"
      : (has("JIRA_BASE_URL") || has("JIRA_URL")) && has("JIRA_EMAIL") && has("JIRA_API_TOKEN")
        ? "basic"
        : (has("JIRA_BASE_URL") || has("JIRA_URL")) && (has("JIRA_PAT") || has("JIRA_PERSONAL_TOKEN"))
          ? "pat"
          : "none";

    const names = [...JIRA_NAMES, ...CONFLUENCE_NAMES];
    const body = {
      // Tells apart "not saved" from "saved to the wrong environment".
      vercelEnv: env.VERCEL_ENV ?? null,
      resolvedJiraCredentials: jiraSet,
      // A base URL is not a secret and pointing at the wrong host is a common slip.
      jiraHost: hostOf(env.JIRA_CLOUD_BASE_URL ?? env.JIRA_CLOUD_URL ?? env.JIRA_BASE_URL ?? env.JIRA_URL),
      variables: Object.fromEntries(names.map((name) => [name, describe(name)])),
    };

    return new Response(JSON.stringify(body, null, 2), {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  },
};

function hostOf(url: string | undefined): string | null {
  if (!url?.trim()) return null;
  try {
    return new URL(url.trim()).host;
  } catch {
    return "unparseable";
  }
}
