import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Connect, Plugin } from "vite";
import { loadEnv } from "vite";
import { SyncError } from "./atlassian.js";
import { runSync, syncErrorStatus } from "./sync.js";

const here = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_DIR = resolve(here, "../src/data/live");

function send(res: Parameters<Connect.NextHandleFunction>[1], status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function parseEnvFile(file: string): Record<string, string> {
  if (!existsSync(file)) return {};
  const values: Record<string, string> = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const value = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
    values[match[1]] = value;
  }
  return values;
}

/**
 * Credentials may live outside this repo — point ENV_FILE at an existing file
 * (for example the regnology-mcp .env) instead of copying secrets around.
 */
function resolveEnv(mode: string) {
  const local = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  const pointer = local.ENV_FILE;
  if (!pointer) return local;

  const file = resolve(process.cwd(), pointer);
  if (!existsSync(file)) {
    throw new SyncError(`ENV_FILE points at ${file}, which does not exist.`, 412);
  }
  return { ...parseEnvFile(file), ...local };
}

async function handleSync(slug: string, mode: string) {
  const snapshot = await runSync(slug, resolveEnv(mode));

  // Only worth doing locally, where the file is committed as the new baseline.
  mkdirSync(SNAPSHOT_DIR, { recursive: true });
  writeFileSync(resolve(SNAPSHOT_DIR, `${slug}.json`), `${JSON.stringify(snapshot, null, 2)}\n`);

  return snapshot;
}

/**
 * Serves POST /api/sync/:slug from the Vite dev and preview servers. The
 * deployed board has no Vite process, so it runs the same sync through
 * api/sync/[slug].ts instead.
 */
export function syncPlugin(): Plugin {
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const match = req.url?.match(/^\/api\/sync\/([\w-]+)\/?$/);
    if (!match) return next();
    if (req.method !== "POST") return send(res, 405, { error: "Use POST." });

    handleSync(match[1], process.env.NODE_ENV ?? "development")
      .then((snapshot) => send(res, 200, snapshot))
      .catch((error: unknown) => {
        send(res, syncErrorStatus(error), { error: (error as Error).message });
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
