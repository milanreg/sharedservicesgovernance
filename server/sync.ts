import type { LiveSnapshot } from "../src/template/types";
// Extensions are explicit throughout this module's graph because it is also
// loaded by Node directly, from the deployed serverless function.
import { buildSnapshot, readCredentials, SyncError } from "./atlassian.js";
import { getSyncConfig } from "./syncConfig.js";

/**
 * Shared by the Vite dev plugin and the deployed serverless function so the
 * hosted board syncs through exactly the same path as a local one. Persisting
 * the result is the caller's business: a deployment has no writable disk.
 */
export async function runSync(
  slug: string,
  env: Record<string, string | undefined>,
): Promise<LiveSnapshot> {
  const config = getSyncConfig(slug);
  if (!config) {
    throw new SyncError(
      `No Jira or Confluence mapping is registered for “${slug}”. Add one in server/syncConfig.ts.`,
      404,
    );
  }

  return buildSnapshot(slug, config, readCredentials(env));
}

export function syncErrorStatus(error: unknown): number {
  return error instanceof SyncError ? error.status : 500;
}
