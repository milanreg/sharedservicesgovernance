import { useLayoutEffect, useRef } from "react";
import { workflowTone } from "../template/status";
import { ticketHref, type ProjectGovernance, type Ticket, type TicketCardId } from "../template/types";

export type { TicketCardId };

const COPY: Record<TicketCardId, { title: string; note: string }> = {
  backlog: {
    title: "Backlog",
    note: "Open tickets in this product's Jira scope, newest first. The card count is the live open total; the list is the latest page the sync could load.",
  },
  sprint: {
    title: "Current sprint",
    note: "Every ticket committed to the active sprint on this board.",
  },
  spillover: {
    title: "Spillover from last sprint",
    note: "Tickets on the current sprint that were also on a previous closed sprint.",
  },
  attention: {
    title: "Needs attention",
    note: "Blocked tickets and items flagged red. Includes blockers still sitting in the backlog.",
  },
};

function TicketRows({ tickets, baseUrl }: { tickets: Ticket[]; baseUrl: string }) {
  if (!tickets.length) return <p className="muted review-empty">No tickets in this set.</p>;

  return (
    <ul className="review-list card-ticket-list">
      {tickets.map((ticket) => (
        <li key={ticket.key}>
          <a href={ticketHref(baseUrl, ticket.key)} target="_blank" rel="noreferrer">
            {ticket.key}
          </a>
          <div className="card-ticket-body">
            <span className="review-item-title">{ticket.summary}</span>
            {ticket.comment ? (
              <small className="card-ticket-comment">
                {ticket.comment.author} · {ticket.comment.date}: {ticket.comment.body}
              </small>
            ) : null}
          </div>
          <span className={`pill ${workflowTone(ticket.status, { blocked: ticket.blocked })}`}>
            {ticket.blocked ? `${ticket.status} · Blocked` : ticket.status}
          </span>
          <span className="review-item-meta">{ticket.owner}</span>
        </li>
      ))}
    </ul>
  );
}

export function TicketListDialog({
  project,
  card,
  tickets,
  total,
  open,
  onClose,
}: {
  project: ProjectGovernance;
  card: TicketCardId;
  tickets: Ticket[];
  total: number;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  const copy = COPY[card];
  return (
    <List
      project={project}
      copy={copy}
      tickets={tickets}
      total={total}
      onClose={onClose}
    />
  );
}

function List({
  project,
  copy,
  tickets,
  total,
  onClose,
}: {
  project: ProjectGovernance;
  copy: { title: string; note: string };
  tickets: Ticket[];
  total: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    ref.current?.showModal();
  }, []);

  const shown = tickets.length;
  const hidden = Math.max(0, total - shown);

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
          <h2>{copy.title}</h2>
          <p className="muted">
            {project.fullName} · {total} ticket{total === 1 ? "" : "s"}
            {hidden ? ` · showing ${shown}` : ""}
          </p>
        </div>
        <button type="button" className="review-close" onClick={onClose} aria-label="Close ticket list">
          ×
        </button>
      </div>

      <div className="review-body">
        <p className="muted review-note">{copy.note}</p>
        <TicketRows tickets={tickets} baseUrl={project.ticketBaseUrl} />
      </div>
    </dialog>
  );
}
