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
  /**
   * Picks one team's sprint when several run concurrently on a shared board.
   * Matched case-insensitively against the sprint name.
   */
  sprintNameContains?: string;
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
  "rconnect-submission": {
    jiraProjectKey: "RCON",
    scopeJql: "project = RCON",
    /**
     * RCON holds two products. Communicator hangs off the RCON-276 "Rconnect
     * for RSH" work package, so removing that subtree leaves Submission —
     * the RCON-271 enablers and the RCON-872 Rconnect CORE tree.
     */
    excludeJql:
      'issue not in portfolioChildIssuesOf("RCON-276") AND key != RCON-276 AND issuetype not in ("Test", "Test Execution")',
    boardId: 3734,
    // Board 3734 runs five active sprints at once, one per team.
    sprintNameContains: "RCON.S",
    confluencePageIds: ["271223446", "274800732", "293881399", "299214127", "307763856"],
  },
};

export function getSyncConfig(slug: string): ProjectSyncConfig | undefined {
  return SYNC_CONFIG[slug];
}
