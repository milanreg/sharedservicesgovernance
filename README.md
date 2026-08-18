# IAM-Stat — Shared Services project governance

Regnology Shared Services dashboard. Landing page opens a three-project
portfolio (IAM, Rconnect Submission, Rconnect Communicator). IAM tabs are
populated from Jira RSH board 2936 and Confluence IAM docs (snapshot 16 Aug 2026).

```bash
npm install
npm run dev
```

## Syncing Jira and Confluence

Each project page has a **Sync Jira and Confluence** button in the top right.
It calls `POST /api/sync/:slug`, which is served by the Vite dev and preview
servers, and refreshes:

- open, done, high-priority, unassigned, and epic counts
- the active sprint with its issues, statuses, and assignees
- current and last release from the project's Jira versions
- version and last-updated date for the tracked Confluence pages

Narrative, architecture, roadmap, RACI, RICE, and risk assessments are
hand-authored judgement and are never overwritten. Risks stay attached to their
ticket key across a sync.

### Credentials

Copy `.env.example` to `.env` and fill it in. `.env` is git-ignored.

| Variable | Notes |
| --- | --- |
| `JIRA_BASE_URL` | e.g. `https://regnology-cloud.atlassian.net` |
| `JIRA_EMAIL` | Atlassian account email |
| `JIRA_API_TOKEN` | [Create one here](https://id.atlassian.com/manage-profile/security/api-tokens) |
| `CONFLUENCE_BASE_URL` | e.g. `https://confluence.regnology.net` |
| `CONFLUENCE_TOKEN` | Confluence personal access token. Optional — without it Jira still syncs |

Without credentials the button returns a clear message and the dashboard keeps
showing the authored snapshot.

### Snapshots

A successful sync writes `src/data/live/<slug>.json`. That file is bundled on
the next load, so refreshed numbers survive a reload and can be committed to
share them with the team.

### Adding a project

Map the slug to its Jira and Confluence identifiers in
`server/syncConfig.ts` (project key, scoping JQL, board id, page ids). Projects
without an entry report that they are not wired up yet.

### Production

The sync endpoint lives in a Vite plugin (`server/syncPlugin.ts`), so it exists
in `npm run dev` and `npm run preview` only. A static production deploy has no
Node process — rehost that handler behind whatever serves the built assets, and
keep the tokens server-side.
