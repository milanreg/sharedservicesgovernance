import { useEffect, useRef } from "react";
import { buildDigest, formatDay, type Digest } from "../template/digest";
import { workflowTone } from "../template/status";
import { ticketHref, type ActivityList, type ProjectGovernance } from "../template/types";

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="review-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="review-section">
      <h3>{title}</h3>
      {note ? <p className="muted review-note">{note}</p> : null}
      {children}
    </section>
  );
}

const CAP = 10;

function ItemList({
  list,
  baseUrl,
  empty,
}: {
  list: ActivityList;
  baseUrl: string;
  empty: string;
}) {
  const { items, total } = list;
  if (!items.length) return empty ? <p className="muted review-empty">{empty}</p> : null;
  const hidden = total - Math.min(items.length, CAP);

  return (
    <>
      <ul className="review-list">
        {items.slice(0, CAP).map((item) => (
          <li key={`${item.key}-${item.date}`}>
            <a href={ticketHref(baseUrl, item.key)} target="_blank" rel="noreferrer">
              {item.key}
            </a>
            <span className="review-item-title">{item.summary}</span>
            <span className={`pill ${workflowTone(item.status)}`}>{item.status}</span>
            <span className="review-item-meta">
              {item.owner}
              {item.date ? ` · ${formatDay(item.date)}` : ""}
            </span>
          </li>
        ))}
      </ul>
      {hidden > 0 ? <p className="muted review-empty">+{hidden} more in Jira.</p> : null}
    </>
  );
}

function Upcoming({ digest, baseUrl }: { digest: Digest; baseUrl: string }) {
  const nothing =
    !digest.releases.length && !digest.due.total && !digest.milestones.length;

  return (
    <>
      {digest.releases.length ? (
        <ul className="review-list">
          {digest.releases.map((release) => (
            <li key={release.name}>
              <span className="pill amber">Release</span>
              <span className="review-item-title">{release.name}</span>
              <span className="review-item-meta">{formatDay(release.date)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {digest.milestones.length ? (
        <ul className="review-list">
          {digest.milestones.map(({ item, kind, date }) => (
            <li key={`${item.id}-${kind}`}>
              {item.ticket ? (
                <a href={ticketHref(baseUrl, item.ticket)} target="_blank" rel="noreferrer">
                  {item.ticket}
                </a>
              ) : (
                <span className="pill">{item.lane ?? "Roadmap"}</span>
              )}
              <span className="review-item-title">{item.label}</span>
              <span className={`pill ${item.status === "blocked" ? "red" : "other"}`}>
                {kind === "ends" ? "planned finish" : "starts"}
              </span>
              <span className="review-item-meta">{formatDay(date)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <ItemList
        list={digest.due}
        baseUrl={baseUrl}
        empty={
          nothing
            ? "No releases, roadmap milestones, or dated Jira work fall in the next 30 days."
            : "No individual Jira items carry a due date in this window."
        }
      />
    </>
  );
}

export function SummaryDialog({
  project,
  open,
  onClose,
}: {
  project: ProjectGovernance;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  // showModal is the only way to get the backdrop, focus trap, and Esc for free.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const digest = buildDigest(project);
  const window = `${formatDay(digest.from.toISOString())} – ${formatDay(digest.to.toISOString())}`;

  return (
    <dialog
      ref={ref}
      className="review"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="review-head">
        <div>
          <h2>{digest.days}-day delivery review</h2>
          <p className="muted">
            {project.fullName} · {window}
            {digest.live ? "" : " · authored snapshot, Jira not yet synced"}
          </p>
        </div>
        <button type="button" className="review-close" onClick={onClose} aria-label="Close review">
          ×
        </button>
      </div>

      <div className="review-stats">
        <Stat value={digest.delivered.total} label="Delivered" />
        <Stat value={digest.raised.total} label="Raised" />
        <Stat
          value={digest.releases.length + digest.due.total + digest.milestones.length}
          label="Landing next"
        />
        <Stat value={digest.blocked.length + digest.overdueReleases.length} label="Blocked" />
        <Stat value={digest.stalled.total} label="Stalled" />
      </div>

      <div className="review-body">
        <Section
          title={`Delivered in the last ${digest.days} days`}
          note={
            digest.live
              ? "Resolved in Jira inside the window."
              : "From the last recorded sprint; sync Jira for a dated list."
          }
        >
          <ItemList
            list={digest.delivered}
            baseUrl={project.ticketBaseUrl}
            empty="Nothing was resolved in this window."
          />
        </Section>

        <Section
          title={`Raised in the last ${digest.days} days`}
          note="New work arriving. Compare with delivered to see whether the backlog is growing."
        >
          <ItemList
            list={digest.raised}
            baseUrl={project.ticketBaseUrl}
            empty="No new items were raised in this window."
          />
        </Section>

        <Section
          title={`Landing in the next ${digest.days} days`}
          note={
            digest.sprintEndsInWindow
              ? `Sprint ${project.sprint.name} ends ${project.sprint.end} with ${project.sprint.committed - project.sprint.done} of ${project.sprint.committed} items still open.`
              : undefined
          }
        >
          <Upcoming digest={digest} baseUrl={project.ticketBaseUrl} />
        </Section>

        <Section
          title="Blockers"
          note="Versions past their date, work that cannot move, and open work Jira has not seen touched for two weeks."
        >
          {digest.overdueReleases.length ? (
            <ul className="review-list">
              {digest.overdueReleases.map((release) => (
                <li key={release.name}>
                  <span className="pill red">Overdue</span>
                  <span className="review-item-title">{release.name}</span>
                  <span className="pill amber">not released</span>
                  <span className="review-item-meta">was due {formatDay(release.date)}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {digest.blocked.length ? (
            <ul className="review-list">
              {digest.blocked.map((ticket) => (
                <li key={ticket.key}>
                  <a href={ticketHref(project.ticketBaseUrl, ticket.key)} target="_blank" rel="noreferrer">
                    {ticket.key}
                  </a>
                  <span className="review-item-title">{ticket.summary}</span>
                  <span className="pill red">{ticket.blocked ? "blocked" : "red risk"}</span>
                  <span className="review-item-meta">{ticket.owner}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted review-empty">Nothing in the current sprint is flagged blocked.</p>
          )}

          {digest.stalled.total ? (
            <>
              <h4 className="review-sub">
                Stalled — {digest.stalled.total} open items with no Jira activity for 14 days
              </h4>
              <ItemList list={digest.stalled} baseUrl={project.ticketBaseUrl} empty="" />
            </>
          ) : null}
        </Section>

        <Section
          title="Bottlenecks"
          note="Structural constraints behind the numbers. These are assessed, not measured."
        >
          {digest.bottlenecks.length ? (
            <ul className="review-bottlenecks">
              {digest.bottlenecks.map((bottleneck) => (
                <li key={bottleneck.title}>
                  <strong>{bottleneck.title}</strong>
                  <span className="review-item-meta">{bottleneck.ticket}</span>
                  <p>{bottleneck.detail}</p>
                  {bottleneck.risk?.mitigation ? (
                    <p className="muted">Mitigation: {bottleneck.risk.mitigation}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted review-empty">No bottlenecks recorded for this product.</p>
          )}
        </Section>
      </div>
    </dialog>
  );
}
