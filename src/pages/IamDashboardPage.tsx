import type { ReactElement } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Gantt } from "../components/Gantt";
import { Topbar } from "../components/Topbar";
import {
  BOARD,
  CONFLUENCE,
  JIRA,
  SNAPSHOT,
  backlogGantt,
  bottlenecks,
  consumers,
  leftoverFrom2615,
  phase2,
  previousSprintClosed,
  raciHeaders,
  raciRows,
  rice,
  riceScore,
  sprint,
  sprintTickets,
  stakeholderGantt,
  stakeholders,
  type Ticket,
} from "../data/iam";

const TABS = [
  { id: "sprint", label: "Sprint details" },
  { id: "spillover", label: "Sprint spillovers" },
  { id: "overview", label: "Product overview" },
  { id: "backlog", label: "Product Gantt" },
  { id: "stakeholders", label: "Stakeholders" },
  { id: "rice", label: "RACI & RICE" },
  { id: "value", label: "Delivery & integration Gantt" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ticketHref(key: string) {
  return `${JIRA}/${key}`;
}

function rowClass(t: Ticket) {
  if (t.blocked) return "row-blocked";
  if (t.status === "Closed") return "row-done";
  if (t.status === "In Quality Review") return "row-qr";
  if (t.status === "In Implementation") return "row-wip";
  if (t.status === "Ready") return "row-ready";
  return "row-new";
}

function TicketTable({ rows }: { rows: Ticket[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Summary</th>
          <th>Why it matters</th>
          <th>Owner</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((t) => (
          <tr key={t.key} className={rowClass(t)}>
            <td>
              <a href={ticketHref(t.key)} target="_blank" rel="noreferrer">
                {t.key}
              </a>
            </td>
            <td>{t.summary}</td>
            <td>{t.why ?? "—"}</td>
            <td>{t.owner}</td>
            <td>
              {t.blocked ? "Ready · Blocked" : t.status}
              {t.spillover ? " · spillover" : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SprintTab() {
  const done = sprintTickets.filter((t) => t.status === "Closed");
  const blocked = sprintTickets.filter((t) => t.blocked);
  const wip = sprintTickets.filter(
    (t) => t.status === "In Implementation" || t.status === "In Quality Review",
  );
  const ready = sprintTickets.filter((t) => t.status === "Ready" && !t.blocked);
  const fresh = sprintTickets.filter((t) => t.status === "New");

  return (
    <section className="panel">
      <h2>Sprint {sprint.name}</h2>
      <p className="muted">
        Active {sprint.start} – {sprint.end} · board{" "}
        <a href={BOARD} target="_blank" rel="noreferrer">
          RSH 2936
        </a>
        . Sixteen IAM items committed. Snapshot {SNAPSHOT}.
      </p>
      <div className="callout">
        Highest delivery risk: privilege escalation{" "}
        <a href={ticketHref("RSH-4220")}>RSH-4220</a> in Quality Review, plus{" "}
        <a href={ticketHref("RSH-2169")}>RSH-2169</a> blocked on MDM. Five of
        sixteen tickets are unassigned.
      </div>

      <h3>Completed this sprint</h3>
      <TicketTable rows={done} />

      <h3>Blocked</h3>
      <TicketTable rows={blocked} />

      <h3>In progress</h3>
      <TicketTable rows={wip} />

      <h3>Ready / not started</h3>
      <TicketTable rows={[...ready, ...fresh]} />
    </section>
  );
}

function SpilloverTab() {
  const carried = sprintTickets.filter((t) => t.spillover);
  return (
    <section className="panel">
      <h2>Sprint spillovers</h2>
      <p className="muted">
        Previous sprint RSH PL 2615 (30 Jul – 13 Aug) closed a large reach-API
        slice. Six of sixteen 2616 items were already on a closed sprint —
        38% of the current IAM commitment is carry-over.
      </p>
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3>Closed in 2615</h3>
          <p className="muted">
            Reach API, entity dimension on permissions, optional initial
            permission, mirroring case bug. Entity-aware roles finished in 2616.
          </p>
        </div>
        <div className="card">
          <h3>Carried into 2616</h3>
          <p className="muted">
            Entity scoping, permission migration, group-id OR-path, dev-cluster
            IAM, OpenSSL. One of six closed this sprint so far.
          </p>
        </div>
        <div className="card">
          <h3>Left 2615 without landing in 2616</h3>
          <p className="muted">
            RForge scaffolding and ContextData OpenAPI at Ready for integration;
            unscoped PU groups at PO Accepted.
          </p>
        </div>
      </div>

      <h3>Still open from prior sprints, now in 2616</h3>
      <TicketTable rows={carried} />

      <h3>Closed in 2615 — not spillover</h3>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Summary</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {previousSprintClosed.map((t) => (
            <tr key={t.key} className="row-done">
              <td>
                <a href={ticketHref(t.key)} target="_blank" rel="noreferrer">
                  {t.key}
                </a>
              </td>
              <td>{t.summary}</td>
              <td>{t.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Finished 2615 flow but not on 2616 board</h3>
      <TicketTable rows={leftoverFrom2615} />
    </section>
  );
}

function OverviewTab() {
  return (
    <section className="panel">
      <h2>Product overview</h2>
      <p className="muted">
        Shared Identity and Access Management for Regnology solutions.
        Synthesized from Jira initiative{" "}
        <a href={ticketHref("RSH-96")}>RSH-96</a>, Phase 2{" "}
        <a href={ticketHref("RSH-903")}>RSH-903</a>, Confluence{" "}
        <a href={CONFLUENCE.integration} target="_blank" rel="noreferrer">
          IAM Integration v17
        </a>
        ,{" "}
        <a href={CONFLUENCE.auth} target="_blank" rel="noreferrer">
          Vizor AuthN/Z v62
        </a>
        , and{" "}
        <a href={CONFLUENCE.offers} target="_blank" rel="noreferrer">
          What IAM Service Offers
        </a>
        .
      </p>
      <div className="callout">
        IAM is the common authentication and authorization module for regulator
        and regulated users. If a Vizor application turns it on, it must be used
        for both Portal and Supervision Centre, and only in containers.
        Foundations shipped. Principal User, entity scoping, permission
        mirroring, and stabilization still decide whether products can retire
        local user management. Initiative RAG: Amber (Jan 2026) — scope creep
        vs original plan.
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Vision</h3>
          <p>
            Centralize identity and permissions so Vizor, R3, and other
            solutions stop owning login, user admin, password, and 2FA. IAM is a
            security orchestration layer: products validate tokens; IAM owns
            users, groups, and permissions.
          </p>
          <p>
            Access is role plus context (module, entity, entity group), with two
            security boundaries — Internal (Supervision Centre) and External
            (Portal / firms). Delegated administration is a Principal User who
            only manages users in their entity scope, only up to their own
            roles.
          </p>
          <p className="muted">
            Owner: Robert Binder. Engineering lead: Adam Ennis. Parent:{" "}
            <a href={ticketHref("RSH-179")}>RSH-179 Scale</a>. Labels: Must, CBBB.
          </p>
        </div>
        <div className="card">
          <h3>What “on” means</h3>
          <p>
            Flip <strong>Security.Login.Type = IAM</strong> (uppercase). That
            overrides every other login type for VSC and VP. On login, email, or
            any user action, the product syncs user and permissions from IAM
            first.
          </p>
          <p>
            Legacy profile, change-password, and 2FA pages are redirected or
            denied. Rconnect expects IAM to provide authN/Z, permission UI/API,
            IDP storage, My profile, and manage-users — and still needs country
            in the permission model.
          </p>
          <p className="muted">
            Architectural driver: custom permissions blow HTTP header limits.
            RFC 8693 token exchange keeps a small ID token on the wire and an
            access token with custom_permissions on the request only.
          </p>
        </div>
      </div>

      <h3>Jira ticket map</h3>
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Ticket</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          <tr className="row-done">
            <td>Authentication</td>
            <td>
              <a href={ticketHref("RSH-97")}>RSH-97</a>
            </td>
            <td>Closed</td>
          </tr>
          <tr className="row-done">
            <td>Authorization</td>
            <td>
              <a href={ticketHref("RSH-100")}>RSH-100</a>
            </td>
            <td>Closed</td>
          </tr>
          <tr className="row-done">
            <td>Self-service</td>
            <td>
              <a href={ticketHref("RSH-105")}>RSH-105</a>
            </td>
            <td>Closed</td>
          </tr>
          <tr className="row-wip">
            <td>Phase 2 (2026)</td>
            <td>
              <a href={ticketHref("RSH-903")}>RSH-903</a>
            </td>
            <td>In Implementation · 3 closed / 4 in implementation / 3 ready / 7 new</td>
          </tr>
          <tr className="row-wip">
            <td>Stabilization</td>
            <td>
              <a href={ticketHref("RSH-4254")}>RSH-4254</a>
            </td>
            <td>New · High · Must · PL 26.3</td>
          </tr>
        </tbody>
      </table>

      <h3>Consuming products</h3>
      <table>
        <thead>
          <tr>
            <th>Consumer</th>
            <th>Ticket</th>
            <th>State</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {consumers.map((c) => (
            <tr key={c.key} className={c.state === "Closed" ? "row-done" : c.state === "New" ? "row-new" : "row-wip"}>
              <td>{c.name}</td>
              <td>
                <a href={ticketHref(c.key)} target="_blank" rel="noreferrer">
                  {c.key}
                </a>
              </td>
              <td>{c.state}</td>
              <td>{c.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Phase 2 epic children (RSH-903)</h3>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Theme</th>
            <th>Owner</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {phase2.map((e) => (
            <tr
              key={e.key}
              className={
                e.status === "Closed"
                  ? "row-done"
                  : e.status === "In Implementation"
                    ? "row-wip"
                    : e.status === "Ready"
                      ? "row-ready"
                      : "row-new"
              }
            >
              <td>
                <a href={ticketHref(e.key)} target="_blank" rel="noreferrer">
                  {e.key}
                </a>
              </td>
              <td>{e.title}</td>
              <td>{e.owner}</td>
              <td>{e.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function BacklogGanttTab() {
  return (
    <section className="panel">
      <h2>Product Gantt from backlog</h2>
      <p className="muted">
        Bars are derived from Phase 1 closed epics, Phase 2 children of{" "}
        <a href={ticketHref("RSH-903")}>RSH-903</a>, current sprint spikes, and
        unscheduled New items. Dates are planning horizons, not Jira due dates
        (those fields are empty on these epics).
      </p>
      <Gantt
        items={backlogGantt}
        caption="Source: RSH-96 / RSH-903 children · RSH board 2936 · snapshot 16 Aug 2026. Today sits in Q3 2026."
      />
    </section>
  );
}

function StakeholdersTab() {
  return (
    <section className="panel">
      <h2>Concerned stakeholders</h2>
      <p className="muted">
        Named from Jira assignees/reporters on RSH-96 and the 2616 board, plus
        Confluence authors of the Vizor and Rconnect IAM pages.
      </p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Org</th>
            <th>RACI lean</th>
            <th>Interest</th>
          </tr>
        </thead>
        <tbody>
          {stakeholders.map((s) => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>{s.role}</td>
              <td>{s.org}</td>
              <td>{s.raci}</td>
              <td>{s.interest}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function RiceTab() {
  const ranked = [...rice].sort((a, b) => riceScore(b) - riceScore(a));
  return (
    <section className="panel">
      <h2>RACI and RICE</h2>
      <p className="muted">
        Product-manager view of who owns what, then which slices of the
        application return the highest ROI if delivered next. RICE = (Reach ×
        Impact × Confidence) / Effort. Reach 1–10 tenants/users, Impact 1–3,
        Confidence 0–1, Effort in sprint-equivalents.
      </p>

      <h3>RACI</h3>
      <table>
        <thead>
          <tr>
            {raciHeaders.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {raciRows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted">R = Responsible, A = Accountable, C = Consulted, I = Informed.</p>

      <h3>RICE — what to deliver for highest ROI</h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Item</th>
            <th>Ticket</th>
            <th>R</th>
            <th>I</th>
            <th>C</th>
            <th>E</th>
            <th>Score</th>
            <th>PM read</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((row, i) => (
            <tr key={row.ticket} className={row.bottleneck ? "row-blocked" : i === 0 ? "row-done" : ""}>
              <td>{i + 1}</td>
              <td>{row.item}</td>
              <td>
                <a href={row.ticket.startsWith("RSH") ? ticketHref(row.ticket) : BOARD} target="_blank" rel="noreferrer">
                  {row.ticket}
                </a>
              </td>
              <td>{row.reach}</td>
              <td>{row.impact}</td>
              <td>{Math.round(row.confidence * 100)}%</td>
              <td>{row.effort}</td>
              <td className="rice-score">{riceScore(row).toFixed(1)}</td>
              <td>{row.why}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Blockers and bottlenecks</h3>
      <div className="grid-2">
        {bottlenecks.map((b) => (
          <div className="card" key={b.title}>
            <h3>{b.title}</h3>
            <p className="muted">{b.ticket}</p>
            <p>{b.detail}</p>
          </div>
        ))}
      </div>

      <div className="callout danger" style={{ marginTop: 20 }}>
        Protect the next 90 days: sequence privilege-escalation, OpenSSL,
        entity scoping, mirroring, and audience/issuer hardening before PAT,
        WCAG, translations, or third-party modules. Treat Principal User
        (RSH-4255) as the milestone that lets Vizor/R3 turn local UM off.
      </div>
    </section>
  );
}

function ValueGanttTab() {
  return (
    <section className="panel">
      <h2>Stakeholder and business-value Gantt</h2>
      <p className="muted">
        Integration roadmap for product delivery with other apps. Data points
        are Jira implementation links on{" "}
        <a href={ticketHref("RSH-96")}>RSH-96</a> plus Confluence consumer
        contracts. Use this view with RTG, CBBB, and consuming POs — not the
        engineering backlog Gantt.
      </p>
      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="card">
          <h3>Shipped value</h3>
          <p>Licensing and R3 Data Collection already consume IAM. Phase 1 authN/Z is Closed.</p>
        </div>
        <div className="card">
          <h3>2026 forcing function</h3>
          <p>
            CBBB / Rconnect needs mirrored permissions. Vizor must stay all-or-nothing
            (Portal + SC, containers only).
          </p>
        </div>
        <div className="card">
          <h3>Unscheduled</h3>
          <p>RFS-1688 is New. PAT, WCAG, Multi-Core, and Windows Server sit after PU.</p>
        </div>
      </div>
      <Gantt
        items={stakeholderGantt}
        caption="Source: RSH-96 issue links · REG-49745 / REG-48802 / RFS-1688 · Confluence IAM Integration v17. Snapshot 16 Aug 2026."
      />
    </section>
  );
}

const PANELS: Record<TabId, () => ReactElement> = {
  sprint: SprintTab,
  spillover: SpilloverTab,
  overview: OverviewTab,
  backlog: BacklogGanttTab,
  stakeholders: StakeholdersTab,
  rice: RiceTab,
  value: ValueGanttTab,
};

export function IamDashboardPage() {
  const [params, setParams] = useSearchParams();
  const tab = (TABS.some((t) => t.id === params.get("tab")) ? params.get("tab") : "sprint") as TabId;
  const Panel = PANELS[tab];

  return (
    <div className="shell">
      <Topbar title="IAM governance" />
      <main className="page">
        <p className="muted">
          <Link to="/projects">← Portfolio</Link>
        </p>
        <div className="iam-head">
          <div>
            <span className="pill amber">Amber</span>
            <span className="pill" style={{ marginLeft: 8 }}>
              RSH Platform
            </span>
            <h1>Identity and Access Management</h1>
            <p className="lede" style={{ marginBottom: 0 }}>
              Shared IAM module · initiative{" "}
              <a href={ticketHref("RSH-96")}>RSH-96</a> · sprint {sprint.name}
            </p>
          </div>
        </div>
        <div className="stats">
          <div className="stat">
            <b>{sprint.committed}</b>
            <span>Committed in {sprint.name}</span>
          </div>
          <div className="stat">
            <b>{sprint.done}</b>
            <span>Completed this sprint</span>
          </div>
          <div className="stat">
            <b>{sprint.inProgress}</b>
            <span>In progress (impl + QR)</span>
          </div>
          <div className="stat">
            <b>{sprint.blocked}</b>
            <span>Needs attention (blocked)</span>
          </div>
        </div>

        <nav className="tabs">
          {TABS.map((t) => (
            <Link
              key={t.id}
              to={`/projects/iam?tab=${t.id}`}
              className={tab === t.id ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setParams({ tab: t.id });
              }}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <Panel />

        <div className="sources">
          Jira: project = RSH AND summary ~ "[IAM]" (634 done, 209 open) · sprint
          in openSprints() on board 2936. Confluence: IAM Integration (v17, Jan
          2026), Vizor Authentication and Authorization (v62, May 2026), What
          IAM Service Offers (v6). Snapshot {SNAPSHOT}.
        </div>
      </main>
    </div>
  );
}
