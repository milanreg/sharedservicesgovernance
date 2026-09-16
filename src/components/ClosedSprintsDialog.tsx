import { useLayoutEffect, useRef } from "react";
import { workflowTone } from "../template/status";
import { ticketHref, type ClosedSprint, type ProjectGovernance, type Ticket } from "../template/types";

function TicketList({
  tickets,
  baseUrl,
  empty,
}: {
  tickets: Ticket[];
  baseUrl: string;
  empty: string;
}) {
  if (!tickets.length) return <p className="muted review-empty">{empty}</p>;

  return (
    <ul className="review-list">
      {tickets.map((ticket) => (
        <li key={ticket.key}>
          <a href={ticketHref(baseUrl, ticket.key)} target="_blank" rel="noreferrer">
            {ticket.key}
          </a>
          <span className="review-item-title">{ticket.summary}</span>
          <span className={`pill ${workflowTone(ticket.status, { blocked: ticket.blocked })}`}>
            {ticket.status}
          </span>
          <span className="review-item-meta">{ticket.owner}</span>
        </li>
      ))}
    </ul>
  );
}

function SprintSection({ sprint, baseUrl }: { sprint: ClosedSprint; baseUrl: string }) {
  const total = sprint.closed.length + sprint.leftover.length;
  const window = [sprint.start, sprint.end].filter(Boolean).join(" – ");

  return (
    <section className="review-section">
      <h3>{sprint.name}</h3>
      <p className="muted review-note">
        {window || "Dates not recorded"} · {sprint.closed.length} closed · {sprint.leftover.length} leftover
        {total ? ` · ${total} items` : ""}
      </p>
      <div className="sprint-history">
        <div>
          <h4 className="review-sub">Closed</h4>
          <TicketList tickets={sprint.closed} baseUrl={baseUrl} empty="Nothing closed in this sprint." />
        </div>
        <div>
          <h4 className="review-sub">Leftover</h4>
          <TicketList
            tickets={sprint.leftover}
            baseUrl={baseUrl}
            empty="Every committed item closed."
          />
        </div>
      </div>
    </section>
  );
}

export function ClosedSprintsDialog({
  project,
  open,
  onClose,
}: {
  project: ProjectGovernance;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return <History project={project} onClose={onClose} />;
}

function History({
  project,
  onClose,
}: {
  project: ProjectGovernance;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    ref.current?.showModal();
  }, []);

  const sprints = project.closedSprints ?? [];
  const closed = sprints.reduce((sum, sprint) => sum + sprint.closed.length, 0);
  const leftover = sprints.reduce((sum, sprint) => sum + sprint.leftover.length, 0);

  return (
    <dialog
      ref={ref}
      className="review sprints-dialog"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="review-head">
        <div>
          <h2>Closed sprints</h2>
          <p className="muted">
            {project.fullName}
            {sprints.length
              ? ` · last ${sprints.length} closed sprint${sprints.length === 1 ? "" : "s"} on the board`
              : " · sync Jira to load closed-sprint history"}
          </p>
        </div>
        <button type="button" className="review-close" onClick={onClose} aria-label="Close sprint history">
          ×
        </button>
      </div>

      {sprints.length ? (
        <div className="review-stats">
          <div className="review-stat">
            <strong>{sprints.length}</strong>
            <span>Sprints</span>
          </div>
          <div className="review-stat">
            <strong>{closed}</strong>
            <span>Closed</span>
          </div>
          <div className="review-stat">
            <strong>{leftover}</strong>
            <span>Leftover</span>
          </div>
        </div>
      ) : null}

      <div className="review-body">
        {sprints.length ? (
          sprints.map((sprint) => (
            <SprintSection key={sprint.id} sprint={sprint} baseUrl={project.ticketBaseUrl} />
          ))
        ) : (
          <p className="muted review-empty">
            No closed sprints are loaded yet. Use Sync Jira and Confluence to pull the last closed
            sprints from this project&apos;s board.
          </p>
        )}
      </div>
    </dialog>
  );
}
