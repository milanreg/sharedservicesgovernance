/**
 * Per-project mapping from a dashboard slug onto the Jira and Confluence
 * objects a sync should read. Identifiers only — credentials come from .env.
 */
export type ProjectSyncConfig = {
  jiraProjectKey: string;
  /** Narrows the project down to one product, e.g. the [IAM] summary prefix. */
  scopeJql: string;
  /**
   * Removed from every count and list. Dropped with a warning if Jira rejects
   * it, so an issue type that exists in one project cannot break another.
   */
  excludeJql?: string;
  boardId?: number;
  confluencePageIds?: string[];
};

export const SYNC_CONFIG: Record<string, ProjectSyncConfig> = {
  iam: {
    jiraProjectKey: "RSH",
    scopeJql: 'project = RSH AND summary ~ "[IAM]"',
    // Xray creates a Test issue per assertion and a Test Execution per CI run.
    // Counting those as product delivery buries the real work.
    excludeJql: 'issuetype not in ("Test", "Test Execution")',
    boardId: 2936,
    confluencePageIds: ["253473412", "266593053", "226552828"],
  },
};

export function getSyncConfig(slug: string): ProjectSyncConfig | undefined {
  return SYNC_CONFIG[slug];
}
