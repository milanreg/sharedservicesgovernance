import type { ReactElement } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Gantt } from "../components/Gantt";
import { RiskInfo, RiskReason } from "../components/RiskInfo";
import { StatusBadge } from "../components/StatusBadge";
import { Topbar } from "../components/Topbar";
import { ragTone, workflowTone } from "../template/status";
import { GOVERNANCE_TABS, isTabId, type TabId } from "../template/tabs";
import {
  riceScore,
  ticketHref,
  type ProjectGovernance,
  type Ticket,
} from "../template/types";

function TicketTable({
  rows,
  baseUrl,
  showRisk = true,
}: {
  rows: Ticket[];
  baseUrl: string;
  showRisk?: boolean;
}) {
  if (!rows.length) {
    return <p className="empty-note">No tickets in this slice.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Summary</th>
          <th>Why it matters</th>
          <th>Owner</th>
          <th>Status</th>
          {showRisk ? <th>Risk</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((t) => (
          <tr key={t.key} className={`row-${workflowTone(t.status, { blocked: t.blocked })}`}>
            <td>
              <a href={ticketHref(baseUrl, t.key)} target="_blank" rel="noreferrer">
                {t.key}
              </a>
            </td>
            <td>{t.summary}</td>
            <td>{t.why ?? "—"}</td>
            <td>{t.owner}</td>
            <td>
              <StatusBadge status={t.status} blocked={t.blocked} spillover={t.spillover} />
            </td>
            {showRisk ? (
              <td>{t.risk ? <RiskReason risk={t.risk} /> : <span className="muted">—</span>}</td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EmptyTab({ title, body }: { title: string; body: string }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <p className="empty-note">{body}</p>
    </section>
  );
}

function SprintTab({ project }: { project: ProjectGovernance }) {
  if (!project.populated) {
    return <EmptyTab title="Sprint details" body={project.sprint.narrative} />;
  }

  const done = project.tickets.filter((t) => workflowTone(t.status) === "green");
  const blocked = project.tickets.filter((t) => t.blocked || workflowTone(t.status, { blocked: t.blocked }) === "red");
  const wip = project.tickets.filter(
    (t) =>
      !t.blocked &&
      (t.status === "In Implementation" || t.status === "In Quality Review"),
  );
  const waiting = project.tickets.filter(
    (t) => !t.blocked && t.status !== "Closed" && t.status !== "In Implementation" && t.status !== "In Quality Review",
  );

  return (
    <section className="panel">
      <h2>Sprint {project.sprint.name}</h2>
      <p className="muted">
        {project.sprint.narrative}{" "}
        {project.boardUrl ? (
          <a href={project.boardUrl} target="_blank" rel="noreferrer">
            Open board
          </a>
        ) : null}
      </p>
      {project.sprint.headline ? <div className="callout">{project.sprint.headline}</div> : null}

      <div className="completed-block">
        <header className="completed-head">
          <h3>Completed this sprint</h3>
          <StatusBadge status="Closed" />
          <span className="completed-count">{done.length} done</span>
        </header>
        <TicketTable rows={done} baseUrl={project.ticketBaseUrl} />
      </div>

      <h3>Blocked</h3>
      <TicketTable rows={blocked} baseUrl={project.ticketBaseUrl} />

      <h3>In progress</h3>
      <TicketTable rows={wip} baseUrl={project.ticketBaseUrl} />

      <h3>Ready / not started</h3>
      <TicketTable rows={waiting} baseUrl={project.ticketBaseUrl} />
    </section>
  );
}

function SpilloverTab({ project }: { project: ProjectGovernance }) {
  if (!project.populated) {
    return <EmptyTab title="Sprint spillovers" body={project.previousSprint.narrative} />;
  }

  const carried = project.tickets.filter((t) => t.spillover);

  return (
    <section className="panel">
      <h2>Sprint spillovers</h2>
      <p className="muted">
        {project.previousSprint.name} ({project.previousSprint.dates}). {project.previousSprint.narrative}
      </p>
      {project.previousSprint.cards.length ? (
        <div className="grid-3" style={{ marginBottom: 20 }}>
          {project.previousSprint.cards.map((card) => (
            <div className="card" key={card.title}>
              <h3>{card.title}</h3>
              <p className="muted">{card.body}</p>
            </div>
          ))}
        </div>
      ) : null}

      <h3>Still open from prior sprints, now in the current sprint</h3>
      <TicketTable rows={carried} baseUrl={project.ticketBaseUrl} />

      <h3>Closed last sprint — not spillover</h3>
      <TicketTable rows={project.previousSprint.closed} baseUrl={project.ticketBaseUrl} showRisk={false} />

      <h3>Left the previous sprint without landing here</h3>
      <TicketTable rows={project.previousSprint.leftover} baseUrl={project.ticketBaseUrl} showRisk={false} />
    </section>
  );
}

function OverviewTab({ project }: { project: ProjectGovernance }) {
  const { overview } = project;
  if (!project.populated) {
    return <EmptyTab title="Product overview" body={overview.intro} />;
  }

  return (
    <section className="panel">
      <h2>Product overview</h2>
      <p className="muted">{overview.intro}</p>
      {overview.callout ? <div className="callout">{overview.callout}</div> : null}

      <div className="grid-2">
        <div className="card">
          <h3>Vision</h3>
          {overview.vision.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <div className="card">
          <h3>What “on” means</h3>
          {overview.contract.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
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
          {overview.layers.map((row) => (
            <tr key={row.key} className={`row-${workflowTone(row.state)}`}>
              <td>{row.layer}</td>
              <td>
                <a href={ticketHref(project.ticketBaseUrl, row.key)} target="_blank" rel="noreferrer">
                  {row.key}
                </a>
              </td>
              <td>
                <StatusBadge status={row.state.split(" · ")[0]} />
              </td>
            </tr>
          ))}
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
          {overview.consumers.map((c) => (
            <tr key={c.key} className={`row-${workflowTone(c.state)}`}>
              <td>{c.name}</td>
              <td>
                <a href={ticketHref(project.ticketBaseUrl, c.key)} target="_blank" rel="noreferrer">
                  {c.key}
                </a>
              </td>
              <td>
                <StatusBadge status={c.state} />
              </td>
              <td>{c.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Backlog epics</h3>
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
          {overview.epics.map((e) => (
            <tr key={e.key} className={`row-${workflowTone(e.status)}`}>
              <td>
                <a href={ticketHref(project.ticketBaseUrl, e.key)} target="_blank" rel="noreferrer">
                  {e.key}
                </a>
              </td>
              <td>{e.title}</td>
              <td>{e.owner}</td>
              <td>
                <StatusBadge status={e.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function BacklogGanttTab({ project }: { project: ProjectGovernance }) {
  return (
    <section className="panel">
      <h2>Product Gantt from backlog</h2>
      <p className="muted">{project.backlogGantt.intro}</p>
      <Gantt
        items={project.backlogGantt.items}
        caption={project.backlogGantt.caption}
        ticketBaseUrl={project.ticketBaseUrl}
      />
    </section>
  );
}

function StakeholdersTab({ project }: { project: ProjectGovernance }) {
  if (!project.stakeholders.length) {
    return (
      <EmptyTab
        title="Stakeholders"
        body="Named stakeholders will appear here from Jira assignees and Confluence authors."
      />
    );
  }

  return (
    <section className="panel">
      <h2>Concerned stakeholders</h2>
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
          {project.stakeholders.map((s) => (
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

function RiceTab({ project }: { project: ProjectGovernance }) {
  if (!project.rice.length && !project.raci.rows.length) {
    return (
      <EmptyTab
        title="RACI & RICE"
        body="RACI and RICE scoring will appear here once the product briefing is connected."
      />
    );
  }

  const ranked = [...project.rice].sort((a, b) => riceScore(b) - riceScore(a));

  return (
    <section className="panel">
      <h2>RACI and RICE</h2>
      <p className="muted">
        Product-manager view of who owns what, then which slices return the highest ROI if
        delivered next. RICE = (Reach × Impact × Confidence) / Effort.
      </p>

      <h3>RACI</h3>
      <table>
        <thead>
          <tr>
            {project.raci.headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {project.raci.rows.map((row) => (
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
            <tr key={row.ticket} className={row.bottleneck ? "row-red" : i === 0 ? "row-green" : ""}>
              <td>{i + 1}</td>
              <td>{row.item}</td>
              <td>
                <a href={ticketHref(project.ticketBaseUrl, row.ticket)} target="_blank" rel="noreferrer">
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
        {project.bottlenecks.map((b) => (
          <div className="card" key={b.title}>
            <h3>
              {b.title}
              {b.risk ? <RiskInfo risk={b.risk} /> : null}
            </h3>
            <p className="muted">{b.ticket}</p>
            <p>{b.detail}</p>
            {b.risk ? <p className="muted">{b.risk.reason}</p> : null}
          </div>
        ))}
      </div>

      {project.next90days ? (
        <div className="callout danger" style={{ marginTop: 20 }}>
          {project.next90days}
        </div>
      ) : null}
    </section>
  );
}

function ValueGanttTab({ project }: { project: ProjectGovernance }) {
  return (
    <section className="panel">
      <h2>Stakeholder and business-value Gantt</h2>
      <p className="muted">{project.stakeholderGantt.intro}</p>
      {project.stakeholderGantt.highlights.length ? (
        <div className="grid-3" style={{ marginBottom: 16 }}>
          {project.stakeholderGantt.highlights.map((h) => (
            <div className="card" key={h.title}>
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </div>
          ))}
        </div>
      ) : null}
      <Gantt
        items={project.stakeholderGantt.items}
        caption={project.stakeholderGantt.caption}
        ticketBaseUrl={project.ticketBaseUrl}
      />
    </section>
  );
}

const PANELS: Record<TabId, (props: { project: ProjectGovernance }) => ReactElement> = {
  sprint: SprintTab,
  spillover: SpilloverTab,
  overview: OverviewTab,
  backlog: BacklogGanttTab,
  stakeholders: StakeholdersTab,
  rice: RiceTab,
  value: ValueGanttTab,
};

export function ProjectDashboard({ project }: { project: ProjectGovernance }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab");
  const tab: TabId = isTabId(requested) ? requested : "sprint";
  const Panel = PANELS[tab];
  const atRisk = project.tickets.filter((t) => t.risk).length;

  return (
    <div className="shell">
      <Topbar title={`${project.name} governance`} />
      <main className="page">
        <p className="muted">
          <Link to="/projects">← Portfolio</Link>
        </p>
        <div className="iam-head">
          <div>
            <span className={`pill ${ragTone(project.rag)}`}>{project.rag}</span>
            <span className="pill" style={{ marginLeft: 8 }}>
              {project.platform}
            </span>
            <h1>{project.fullName}</h1>
            <p className="lede" style={{ marginBottom: 0 }}>
              {project.initiativeKey ? (
                <>
                  Initiative{" "}
                  <a href={ticketHref(project.ticketBaseUrl, project.initiativeKey)} target="_blank" rel="noreferrer">
                    {project.initiativeKey}
                  </a>
                  {" · "}
                </>
              ) : null}
              sprint {project.sprint.name}
            </p>
          </div>
        </div>

        <div className="status-legend" aria-label="Status colours">
          <span>
            <i className="swatch green" />
            Green — completed
          </span>
          <span>
            <i className="swatch amber" />
            Amber — at risk / waiting
          </span>
          <span>
            <i className="swatch red" />
            Red — blocked or critical
          </span>
          <span>
            <i className="swatch other" />
            Other — in progress or new
          </span>
        </div>

        <div className="stats">
          <div className="stat">
            <b>{project.sprint.committed}</b>
            <span>Committed in {project.sprint.name}</span>
          </div>
          <div className="stat stat-done">
            <b>{project.sprint.done}</b>
            <span>Completed this sprint</span>
          </div>
          <div className="stat">
            <b>{project.sprint.inProgress}</b>
            <span>In progress (impl + QR)</span>
          </div>
          <div className="stat stat-alert">
            <b>{project.sprint.blocked || atRisk}</b>
            <span>Needs attention</span>
          </div>
        </div>

        <nav className="tabs" aria-label="Governance views">
          {GOVERNANCE_TABS.map((t) => (
            <Link
              key={t.id}
              to={`/projects/${project.slug}?tab=${t.id}`}
              className={tab === t.id ? "active" : ""}
              aria-current={tab === t.id ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setParams({ tab: t.id });
              }}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <Panel project={project} />

        <div className="sources">
          {project.sources}
          {project.snapshot ? ` Snapshot ${project.snapshot}.` : ""}
        </div>
      </main>
    </div>
  );
}
