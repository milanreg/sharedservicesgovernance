import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Connect, Plugin } from "vite";
import { loadEnv } from "vite";
import { buildSnapshot, readCredentials, SyncError } from "./atlassian";
import { getSyncConfig } from "./syncConfig";

const here = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_DIR = resolve(here, "../src/data/live");

function send(res: Parameters<Connect.NextHandleFunction>[1], status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

async function handleSync(slug: string, mode: string) {
  const config = getSyncConfig(slug);
  if (!config) {
    throw new SyncError(
      `No Jira or Confluence mapping is registered for “${slug}”. Add one in server/syncConfig.ts.`,
      404,
    );
  }

  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  const snapshot = await buildSnapshot(slug, config, readCredentials(env));

  mkdirSync(SNAPSHOT_DIR, { recursive: true });
  writeFileSync(resolve(SNAPSHOT_DIR, `${slug}.json`), `${JSON.stringify(snapshot, null, 2)}\n`);

  return snapshot;
}

/**
 * Serves POST /api/sync/:slug from the Vite dev and preview servers. A static
 * production deploy has no Node process, so it needs this handler rehosted
 * behind whatever serves the built assets.
 */
export function syncPlugin(): Plugin {
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const match = req.url?.match(/^\/api\/sync\/([\w-]+)\/?$/);
    if (!match) return next();
    if (req.method !== "POST") return send(res, 405, { error: "Use POST." });

    handleSync(match[1], process.env.NODE_ENV ?? "development")
      .then((snapshot) => send(res, 200, snapshot))
      .catch((error: unknown) => {
        const status = error instanceof SyncError ? error.status : 500;
        send(res, status, { error: (error as Error).message });
      });
  };

  return {
    name: "governance-sync",
    configureServer: (server) => {
      server.middlewares.use(middleware);
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(middleware);
    },
  };
}
