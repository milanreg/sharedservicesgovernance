/**
 * Per-project mapping from a dashboard slug onto the Jira and Confluence
 * objects a sync should read. Identifiers only — credentials come from .env.
 */
export type ProjectSyncConfig = {
  jiraProjectKey: string;
  /** Narrows the project down to one product. */
  scopeJql: string;
  /**
   * Removed from every count and list. Dropped with a warning if Jira rejects
   * it, so an issue type that exists in one project cannot break another.
   */
  excludeJql?: string;
  boardId?: number;
  /**
   * Picks one team's sprint when several run concurrently on a shared board.
   * Matched case-insensitively against the sprint name; any one of several
   * values may match, which covers a team mid-rename. If nothing matches, the
   * sync reports no sprint rather than borrowing another team's.
   */
  sprintNameContains?: string | string[];
  /**
   * Keeps one product's releases when a Jira project holds two. Matched
   * case-insensitively against the start of the version name.
   */
  releaseNamePrefix?: string;
  confluencePageIds?: string[];
};

export const SYNC_CONFIG: Record<string, ProjectSyncConfig> = {
  iam: {
    jiraProjectKey: "RSH",
    /**
     * Two halves, because neither alone is the product. The RSH-96 initiative
     * subtree holds IAM work that predates the naming convention (Sign in /
     * Sign out, permission mirroring, the CLIENTS and SETTINGS stories), while
     * the summary match catches the "[IAM]" prefixed stories raised outside it.
     *
     * The prefix cannot be matched directly: Jira's text search ignores
     * punctuation, so `summary ~ "[IAM]"` silently matches nothing at all and
     * once zeroed this dashboard. Matching the bare token and excluding Xray
     * artefacts is the closest stable equivalent.
     */
    scopeJql: 'project = RSH AND (issue in portfolioChildIssuesOf("RSH-96") OR summary ~ "IAM")',
    /**
     * Xray generates a Test per assertion, a Test Execution per CI run, and a
     * Test Set per covered issue — over a thousand of the latter mention IAM in
     * their summary. Counting those as product delivery buries the real work.
     */
    excludeJql:
      'issuetype not in ("Test", "Test Execution", "Test Set", "Test Plan", "Precondition")',
    boardId: 2936,
    sprintNameContains: ["RSH IAM", "RSH PL"],
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
    // Submission moved onto its own board; 3734 is now Communicator's.
    boardId: 4494,
    sprintNameContains: "RCON.S",
    releaseNamePrefix: "RCON.S",
    confluencePageIds: ["271223446", "274800732", "293881399", "299214127", "307763856"],
  },
  "rconnect-communicator": {
    jiraProjectKey: "RCON",
    scopeJql: "project = RCON",
    // The mirror image of the Submission scope: keep only the RCON-276 subtree.
    excludeJql:
      'issue in portfolioChildIssuesOf("RCON-276") AND issuetype not in ("Test", "Test Execution")',
    /**
     * Board 3734 is RCON.C, but it is an old shared board that still carries
     * [WD-40], [DHL] and [WA] sprints from EON, ONADD and ION. Those hold no
     * RCON issues whatsoever, so the name filter is what keeps another team's
     * sprint out of this dashboard.
     */
    boardId: 3734,
    sprintNameContains: ["Communicator", "RCON.C", "YOLO"],
    releaseNamePrefix: "RCON.C",
  },
};

export function getSyncConfig(slug: string): ProjectSyncConfig | undefined {
  return SYNC_CONFIG[slug];
}
