import { useEffect, useState } from "react";
import { formatSyncedAt } from "../data/live";
import type { LiveSnapshot } from "../template/types";

type State = "idle" | "syncing" | "done" | "error";

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

/** Past this, the board is old enough that the reader should be told plainly. */
const STALE_AFTER = DAY;

/**
 * An absolute date alone reads as fine even when it is a week old, which is how
 * a tab left open since the last sync ends up trusted. The age says otherwise.
 */
function relativeAge(iso: string, now: number): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const ms = Math.max(0, now - then);
  if (ms < MINUTE) return "just now";
  if (ms < HOUR) {
    const minutes = Math.round(ms / MINUTE);
    return `${minutes} min ago`;
  }
  if (ms < DAY) {
    const hours = Math.round(ms / HOUR);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.round(ms / DAY);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/**
 * A header is the wrong place for a wall of warnings — one line here, the rest
 * on hover. Warnings that differ only by an id are counted, not repeated.
 */
function summarize(snapshot: LiveSnapshot): string {
  const { warnings, tickets, confluence } = snapshot;
  if (!warnings.length) {
    return `Synced ${tickets.length} sprint items and ${confluence.length} Confluence pages.`;
  }

  const groups = new Map<string, number>();
  for (const warning of warnings) {
    const shape = warning.replace(/\b\d{4,}\b/g, "…");
    groups.set(shape, (groups.get(shape) ?? 0) + 1);
  }

  const [shape, repeats] = [...groups][0];
  const rest = groups.size > 1 ? ` (+${groups.size - 1} more)` : "";
  return `Synced ${tickets.length} sprint items. ${repeats > 1 ? `${repeats}× ` : ""}${shape}${rest}`;
}

export function SyncButton({
  slug,
  lastSynced,
  onSynced,
}: {
  slug: string;
  lastSynced?: string;
  onSynced: (snapshot: LiveSnapshot) => void;
}) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  // Naming the origin matters: the failure is usually that this tab is pointed
  // at a different port than the server that has the endpoint. A hosted origin
  // fails for entirely different reasons, so the advice has to differ too.
  const origin = window.location.origin;
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

  // Ticks so the elapsed counter moves during a sync and the age of the last
  // sync keeps climbing in a tab nobody has reloaded.
  useEffect(() => {
    const period = state === "syncing" ? 1000 : 30_000;
    const id = window.setInterval(() => setNow(Date.now()), period);
    return () => window.clearInterval(id);
  }, [state]);

  const sync = async () => {
    setState("syncing");
    setMessage(null);
    setDetail(null);
    setStartedAt(Date.now());
    setNow(Date.now());
    try {
      let response: Response;
      try {
        response = await fetch(`/api/sync/${slug}`, { method: "POST" });
      } catch {
        throw new Error(
          local
            ? `Could not reach ${origin}. The server that served this page has stopped — start it with npm run dev and reload.`
            : `Could not reach ${origin}. Check your connection and try again.`,
        );
      }

      // A server older than the sync endpoint answers with an HTML 404 page.
      const raw = await response.text();
      let body: { error?: string } | LiveSnapshot;
      try {
        body = JSON.parse(raw);
      } catch {
        throw new Error(
          `${origin} has no sync endpoint (HTTP ${response.status}). ${
            local
              ? "It is an older server left running from a previous session. Stop it, run npm run dev, and reload this page from the address it prints."
              : "This deployment is missing the sync function — redeploy from a commit that includes api/sync."
          }`,
        );
      }
      if (!response.ok) {
        throw new Error(("error" in body && body.error) || `Sync failed (${response.status}).`);
      }

      const snapshot = body as LiveSnapshot;
      onSynced(snapshot);
      setState("done");
      setMessage(summarize(snapshot));
      setDetail(snapshot.warnings.join("\n") || null);
    } catch (error) {
      setState("error");
      setMessage((error as Error).message);
    }
  };

  const syncing = state === "syncing";
  const elapsed = Math.max(0, Math.round((now - startedAt) / 1000));
  const age = lastSynced ? relativeAge(lastSynced, now) : "";
  const stale = Boolean(lastSynced) && now - new Date(lastSynced!).getTime() > STALE_AFTER;

  return (
    <div className="sync">
      <button
        type="button"
        className="sync-btn"
        onClick={sync}
        disabled={syncing}
        aria-busy={syncing}
      >
        {syncing ? (
          <>
            <span className="sync-spinner" aria-hidden="true" />
            Syncing…
          </>
        ) : (
          "Sync Jira and Confluence"
        )}
      </button>
      <small className={`sync-note ${stale && !syncing ? "sync-stale" : ""}`} aria-live="polite">
        {syncing
          ? `Fetching live data from Jira and Confluence… ${elapsed}s`
          : lastSynced
            ? `Last synced ${formatSyncedAt(lastSynced)} · ${age}`
            : "Showing the authored snapshot"}
      </small>
      {message ? (
        <small className={`sync-msg sync-${state}`} title={detail ?? undefined}>
          {message}
        </small>
      ) : null}
    </div>
  );
}
