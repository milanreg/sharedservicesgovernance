import type { ReactElement } from "react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Gantt } from "../components/Gantt";
import { RiskInfo, RiskReason } from "../components/RiskInfo";
import { StatusBadge } from "../components/StatusBadge";
import { Topbar } from "../components/Topbar";
import { ragTone, workflowTone } from "../template/status";
import { isSprintSlice, sprintSlices, type SprintSlice } from "../template/slices";
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

function SummaryTab({ project }: { project: ProjectGovernance }) {
  const s = project.projectSummary;
  const groups = sprintSlices(project.tickets);
  if (!project.populated) {
    return <EmptyTab title="Summary" body={s.narrative} />;
  }

  return (
    <section className="panel">
      <h2>Project summary</h2>
      <p className="muted">
        {s.narrative}{" "}
        {s.jiraUrl ? (
          <a href={s.jiraUrl} target="_blank" rel="noreferrer">
            Open Jira project summary
          </a>
        ) : null}
      </p>

      <div className="stats">
        <div className="stat">
          <b>{s.done}</b>
          <span>Done Identity and Access Management tickets</span>
          <small>Jira: status category Done</small>
        </div>
        <div className="stat">
          <b>{s.open}</b>
          <span>Open Identity and Access Management tickets</span>
          <small>Jira: status category not Done</small>
        </div>
        <div className="stat stat-alert">
          <b>{s.highPriorityOpen}</b>
          <span>High or critical still open</span>
          <small>Priority Highest, High, or Critical</small>
        </div>
        <div className="stat">
          <b>{s.unassignedOpen}</b>
          <span>Open and unassigned</span>
          <small>Assignee is empty</small>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Releases</h3>
          {s.currentRelease ? (
            <p>
              Current: {s.currentRelease.name} · {s.currentRelease.date} ·{" "}
              {s.currentRelease.released ? "Released" : "Unreleased"}
            </p>
          ) : null}
          {s.lastRelease ? (
            <p className="muted">
              Last released: {s.lastRelease.name} · {s.lastRelease.date}
            </p>
          ) : null}
          <p className="muted">{s.epics} Identity and Access Management epics on the board.</p>
        </div>
        <div className="card">
          <h3>This sprint mix</h3>
          <p>Closed {groups.done.length} · Implementation + Quality Review {groups.wip.length} · Blocked {groups.attention.length} · Waiting {groups.waiting.length} · Committed {groups.committed.length}</p>
          <p className="muted">{project.sprint.headline}</p>
        </div>
      </div>

      <h3>Glossary</h3>
      <table>
        <thead>
          <tr>
            <th>Term</th>
            <th>Full form</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["RSH", "Regnology Supervision Hub"],
            ["IAM", "Identity and Access Management"],
            ["MDM", "Master Data Management"],
            ["VAS", "Vizor API Service"],
            ["IDP", "Identity Provider"],
            ["PAT", "Personal Access Token"],
            ["WCAG", "Web Content Accessibility Guidelines"],
            ["CBBB", "Central Bank of Barbados"],
            ["RACI", "Responsible, Accountable, Consulted, Informed"],
            ["RICE", "Reach, Impact, Confidence, Effort"],
            ["Principal User", "Delegated entity-scoped user administrator"],
          ].map(([term, full]) => (
            <tr key={term}>
              <td>{term}</td>
              <td>{full}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function PmTab({ project }: { project: ProjectGovernance }) {
  const focus = project.pmFocus;
  if (!project.populated) {
    return (
      <EmptyTab
        title="PM delivery focus"
        body="Product-manager delivery actions will appear here once the briefing is connected."
      />
    );
  }

  const unassigned = project.tickets.filter((t) => t.owner === "Unassigned" && t.status !== "Closed");
  const red = project.tickets.filter((t) => t.risk?.level === "red");
  const ranked = [...project.rice].sort((a, b) => riceScore(b) - riceScore(a)).slice(0, 3);

  return (
    <section className="panel">
      <h2>Product manager delivery focus</h2>
      <p className="muted">
        Working view for this sprint: what to protect, what to sequence, and which
        questions still need an answer before the next release.
      </p>

      <div className="callout danger">{project.next90days}</div>

      <h3>Do this sprint</h3>
      <ol className="pm-list">
        {focus.thisSprint.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      <h3>Delivery sequence (highest return first)</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Ticket</th>
            <th>Why it is next</th>
          </tr>
        </thead>
        <tbody>
          {focus.sequence.map((row) => (
            <tr key={row.ticket}>
              <td>{row.order}</td>
              <td>{row.item}</td>
              <td>
                <a href={ticketHref(project.ticketBaseUrl, row.ticket)} target="_blank" rel="noreferrer">
                  {row.ticket}
                </a>
              </td>
              <td>{row.why}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid-2">
        <div>
          <h3>Red risks still open</h3>
          <TicketTable rows={red} baseUrl={project.ticketBaseUrl} />
        </div>
        <div>
          <h3>Unassigned in this sprint</h3>
          <TicketTable rows={unassigned} baseUrl={project.ticketBaseUrl} />
        </div>
      </div>

      <h3>Top RICE (Reach × Impact × Confidence / Effort)</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Ticket</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((row) => (
            <tr key={row.ticket}>
              <td>{row.item}</td>
              <td>
                <a href={ticketHref(project.ticketBaseUrl, row.ticket)} target="_blank" rel="noreferrer">
                  {row.ticket}
                </a>
              </td>
              <td className="rice-score">{riceScore(row).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Open questions</h3>
      <ul className="pm-list">
        {focus.questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
    </section>
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

function SprintTab({
  project,
  slice,
}: {
  project: ProjectGovernance;
  slice?: SprintSlice;
}) {
  if (!project.populated) {
    return <EmptyTab title="Sprint details" body={project.sprint.narrative} />;
  }

  const groups = sprintSlices(project.tickets);
  const focus = (id: SprintSlice) => (slice === id ? "section-focus" : "");

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
      {slice === "committed" ? (
        <div className="section-focus" id="slice-committed">
          <h3>All tickets in this sprint commitment</h3>
          <TicketTable rows={groups.committed} baseUrl={project.ticketBaseUrl} />
        </div>
      ) : (
        <div id="slice-committed" />
      )}

      <div className={`completed-block ${focus("done")}`} id="slice-done">
        <header className="completed-head">
          <h3>Completed this sprint</h3>
          <StatusBadge status="Closed" />
          <span className="completed-count">{groups.done.length} done</span>
        </header>
        <TicketTable rows={groups.done} baseUrl={project.ticketBaseUrl} />
      </div>

      <div className={focus("attention")} id="slice-attention">
        <h3>Blocked</h3>
        <TicketTable rows={groups.attention} baseUrl={project.ticketBaseUrl} />
      </div>

      <div className={focus("wip")} id="slice-wip">
        <h3>In progress (Implementation + Quality Review)</h3>
        <TicketTable rows={groups.wip} baseUrl={project.ticketBaseUrl} />
      </div>

      <div id="slice-waiting">
        <h3>Ready / not started</h3>
        <TicketTable rows={groups.waiting} baseUrl={project.ticketBaseUrl} />
      </div>
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
        Product-manager view of who owns what, then which slices return the highest return on
        investment if delivered next. RACI is Responsible, Accountable, Consulted, Informed. RICE is
        (Reach × Impact × Confidence) / Effort.
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

const PANELS: Record<
  TabId,
  (props: { project: ProjectGovernance; slice?: SprintSlice }) => ReactElement
> = {
  summary: ({ project }) => <SummaryTab project={project} />,
  sprint: ({ project, slice }) => <SprintTab project={project} slice={slice} />,
  spillover: ({ project }) => <SpilloverTab project={project} />,
  pm: ({ project }) => <PmTab project={project} />,
  overview: ({ project }) => <OverviewTab project={project} />,
  backlog: ({ project }) => <BacklogGanttTab project={project} />,
  stakeholders: ({ project }) => <StakeholdersTab project={project} />,
  rice: ({ project }) => <RiceTab project={project} />,
  value: ({ project }) => <ValueGanttTab project={project} />,
};

function TicketKeys({ tickets, baseUrl }: { tickets: Ticket[]; baseUrl: string }) {
  if (!tickets.length) return null;
  const shown = tickets.slice(0, 4);
  const rest = tickets.length - shown.length;
  return (
    <small className="stat-keys">
      {shown.map((t, i) => (
        <span key={t.key}>
          {i > 0 ? ", " : ""}
          <a href={ticketHref(baseUrl, t.key)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            {t.key}
          </a>
        </span>
      ))}
      {rest > 0 ? ` +${rest} more` : ""}
    </small>
  );
}

export function ProjectDashboard({ project }: { project: ProjectGovernance }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab");
  const tab: TabId = isTabId(requested) ? requested : "summary";
  const requestedSlice = params.get("slice");
  const slice = isSprintSlice(requestedSlice) ? requestedSlice : undefined;
  const Panel = PANELS[tab];
  const groups = sprintSlices(project.tickets);

  useEffect(() => {
    if (tab !== "sprint" || !slice) return;
    document.getElementById(`slice-${slice}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [tab, slice]);

  const openSlice = (next: SprintSlice) => {
    setParams({ tab: "sprint", slice: next });
  };

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
          <button
            type="button"
            className={`stat ${slice === "committed" ? "stat-active" : ""}`}
            onClick={() => openSlice("committed")}
          >
            <b>{groups.committed.length}</b>
            <span>Committed in {project.sprint.name}</span>
            <TicketKeys tickets={groups.committed} baseUrl={project.ticketBaseUrl} />
          </button>
          <button
            type="button"
            className={`stat stat-done ${slice === "done" ? "stat-active" : ""}`}
            onClick={() => openSlice("done")}
          >
            <b>{groups.done.length}</b>
            <span>Completed this sprint</span>
            <TicketKeys tickets={groups.done} baseUrl={project.ticketBaseUrl} />
          </button>
          <button
            type="button"
            className={`stat ${slice === "wip" ? "stat-active" : ""}`}
            onClick={() => openSlice("wip")}
          >
            <b>{groups.wip.length}</b>
            <span>In progress (Implementation + Quality Review)</span>
            <TicketKeys tickets={groups.wip} baseUrl={project.ticketBaseUrl} />
          </button>
          <button
            type="button"
            className={`stat stat-alert ${slice === "attention" ? "stat-active" : ""}`}
            onClick={() => openSlice("attention")}
          >
            <b>{groups.attention.length}</b>
            <span>Needs attention</span>
            <TicketKeys tickets={groups.attention} baseUrl={project.ticketBaseUrl} />
          </button>
        </div>
        <p className="muted stat-hint">Click a number to open the matching tickets on Sprint details.</p>

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

        <Panel project={project} slice={slice} />

        <div className="sources">
          {project.sources}
          {project.snapshot ? ` Snapshot ${project.snapshot}.` : ""}
        </div>
      </main>
    </div>
  );
}
