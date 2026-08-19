# IAM-Stat — Shared Services project governance

Regnology Shared Services dashboard. Landing page opens a three-project
portfolio (IAM, Rconnect Submission, Rconnect Communicator). IAM tabs are
populated from Jira RSH board 2936 and Confluence IAM docs (snapshot 16 Aug 2026).

```bash
npm install
npm run dev    # http://localhost:5173 — sources, hot reload
npm start      # http://localhost:4173 — built assets, same sync endpoint
```

Both ports are pinned with `strictPort`, so a second server fails to start
rather than drifting to the next free port. That matters: a server left running
from an earlier session keeps answering on the address in your bookmark, and if
it predates a feature it will 404 the requests the current code makes. If
`npm run dev` reports the port is in use, stop the old process instead of
letting two servers coexist.

## Syncing Jira and Confluence

Each project page has a **Sync Jira and Confluence** button in the top right.
It calls `POST /api/sync/:slug`, which is served by the Vite dev and preview
servers, and refreshes:

- open, done, high-priority, unassigned, and epic counts
- the active sprint with its issues, statuses, and assignees
- current and last release from the project's Jira versions
- version and last-updated date for the tracked Confluence pages
- the 30-day activity window behind the delivery review

Narrative, architecture, roadmap, RACI, RICE, and risk assessments are
hand-authored judgement and are never overwritten. Risks stay attached to their
ticket key across a sync.

## 30-day delivery review

The **Summary** button next to Sync opens a dialog covering the window
either side of today: what was delivered and raised in the last 30 days, what is
due to land in the next 30 (releases, dated Jira work, and roadmap milestones),
and what is stuck — overdue unreleased versions, blocked tickets, open work Jira
has not seen touched for 14 days, and the authored bottlenecks.

Counts come from Jira, not from the sample rows shown, so a list capped at ten
still reports the true total. Without a sync the dialog falls back to the last
recorded sprint and says so.

### Credentials

Copy `.env.example` to `.env` and fill it in. `.env` is git-ignored.

| Variable | Notes |
| --- | --- |
| `JIRA_BASE_URL` | e.g. `https://regnology-cloud.atlassian.net` |
| `JIRA_EMAIL` | Atlassian account email |
| `JIRA_API_TOKEN` | [Create one here](https://id.atlassian.com/manage-profile/security/api-tokens) |
| `CONFLUENCE_BASE_URL` | e.g. `https://confluence.regnology.net` |
| `CONFLUENCE_TOKEN` | Confluence personal access token. Optional — without it Jira still syncs |

If you already keep these somewhere else, set `ENV_FILE` to that file's path and
leave the rest blank. The `JIRA_CLOUD_BASE_URL` / `JIRA_CLOUD_EMAIL` /
`JIRA_CLOUD_API_TOKEN` and `CONFLUENCE_URL` / `CONFLUENCE_PAT` names are also
accepted, and the Cloud triple wins when a file defines both a Cloud and a Data
Center Jira.

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

Use `excludeJql` to keep machine-generated issues out of every count. IAM
excludes Xray `Test` and `Test Execution` issues, which otherwise added roughly
270 phantom "delivered" items per month. An exclusion Jira rejects is dropped
with a warning rather than failing the sync.

### Production

The sync endpoint lives in a Vite plugin (`server/syncPlugin.ts`), so it needs a
Node process. `npm start` builds and then serves the built app through
`vite preview`, which runs the same handler — use that for a shared internal
instance. A file-copy deploy to a static host has no Node process and the Sync
button will 404 there; rehost the handler behind whatever serves the assets, and
keep the tokens server-side either way.
