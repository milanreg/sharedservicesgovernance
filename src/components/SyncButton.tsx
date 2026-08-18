import { useState } from "react";
import { formatSyncedAt } from "../data/live";
import type { LiveSnapshot } from "../template/types";

type State = "idle" | "syncing" | "done" | "error";

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

  const sync = async () => {
    setState("syncing");
    setMessage(null);
    try {
      let response: Response;
      try {
        response = await fetch(`/api/sync/${slug}`, { method: "POST" });
      } catch {
        throw new Error(
          "Could not reach the sync endpoint. The dev server that served this page is not running — restart it with npm run dev and reload.",
        );
      }

      // A stopped or plugin-less server answers with an HTML error page.
      const raw = await response.text();
      let body: { error?: string } | LiveSnapshot;
      try {
        body = JSON.parse(raw);
      } catch {
        throw new Error(
          `The sync endpoint returned ${response.status} as HTML, not JSON. This page is probably served by a build or a server without the sync plugin — run npm run dev and reload.`,
        );
      }
      if (!response.ok) {
        throw new Error(("error" in body && body.error) || `Sync failed (${response.status}).`);
      }

      const snapshot = body as LiveSnapshot;
      onSynced(snapshot);
      setState("done");
      setMessage(
        snapshot.warnings.length
          ? `Synced with ${snapshot.warnings.length} warning${snapshot.warnings.length > 1 ? "s" : ""}: ${snapshot.warnings.join(" ")}`
          : `Synced ${snapshot.tickets.length} sprint items and ${snapshot.confluence.length} Confluence pages.`,
      );
    } catch (error) {
      setState("error");
      setMessage((error as Error).message);
    }
  };

  return (
    <div className="sync">
      <button type="button" className="sync-btn" onClick={sync} disabled={state === "syncing"}>
        {state === "syncing" ? "Syncing…" : "Sync Jira and Confluence"}
      </button>
      <small className="sync-note">
        {lastSynced ? `Last synced ${formatSyncedAt(lastSynced)}` : "Showing the authored snapshot"}
      </small>
      {message ? <small className={`sync-msg sync-${state}`}>{message}</small> : null}
    </div>
  );
}
