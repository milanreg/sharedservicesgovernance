# IAM-Stat — Shared Services project governance

Regnology Shared Services dashboard. The landing page carries a three-project
portfolio, all three connected:

- **IAM** — Jira RSH board 2936 plus the Confluence IAM docs (snapshot 16 Aug 2026).
- **Rconnect Submission** — Jira RCON board 3734 plus the Confluence RCON space:
  seven architecture decision records, the Rconnect and NiFi integration guides,
  the production deployment guide, and the security triage.
- **Rconnect Communicator** — the RCON-276 subtree on the same board, sprint
  `Yolo - Communicator Sprint 21`. Its design decisions live in epic and story
  descriptions rather than Confluence, so the briefing is sourced from Jira.

One Jira project holds both Rconnect products, so the two scopes are mirror
images: Submission excludes the RCON-276 subtree and Communicator keeps only it.
Board 3734 also runs several teams' sprints at once, which is what
`sprintNameContains` picks between — `RCON.S` for Submission, `Communicator` for
Communicator. See `server/syncConfig.ts`.

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

## Ask the board

Every project page has an **Ask about {product}** button in the bottom-right
corner. It answers from the same payload the tabs render — sprint, tickets,
risks, architecture, deployment, roadmap, stakeholders, RICE — and quotes that
data rather than generating prose. Ticket keys, "what is blocked", "what should
we do first", and "how does the architecture work" are handled as first-class
questions; everything else is retrieved by search over those passages.

The [IAM user guide](https://main.docs.dev.suptech.regnology.io/user-guide/iam/iam-overview/)
sits behind Okta, so the assistant cannot read it at runtime. After you sign in
in a browser, copy the `_oauth2_proxy` cookie and run:

```powershell
$env:DOCS_COOKIE = "_oauth2_proxy=<value>"
npm run ingest:docs
```

That writes `src/data/docs/iam.json`, which is then indexed the same way as the
governance payload. Until that file exists, questions about the user guide are
answered with a link to the page rather than a paraphrase of content we have
not read.

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

Syncing needs a Node process, and there are three that provide one. Locally the
Vite plugin (`server/syncPlugin.ts`) serves it in `npm run dev` and in
`npm start`, which builds and serves through `vite preview`. On Vercel the same
sync runs as a function from `api/sync/[slug].ts`. All three call `runSync` in
`server/sync.ts`, so the deployed board syncs through the same code as a local
one, and tokens stay server-side in every case.

Two differences on the deployed board. It cannot write `src/data/live/<slug>.json`,
because the filesystem there is read-only and per-request — a sync refreshes the
open page, and the committed snapshot remains the baseline every fresh load
starts from. Commit a local sync to move that baseline. It also reaches only
what is on the public internet: Jira Cloud syncs fine, while Confluence Data
Center and Jira Data Center sit behind the VPN and come back as warnings.

Set `JIRA_CLOUD_BASE_URL`, `JIRA_CLOUD_EMAIL`, and `JIRA_CLOUD_API_TOKEN` as
environment variables in the Vercel project. Without them the endpoint answers
412 and says so, rather than failing silently.
`vercel.json` also routes every non-`/api` path to `index.html`; without it the
host serves 404 for deep links like `/projects/iam`, since the router is
client-side.
