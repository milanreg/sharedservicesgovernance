import type { LiveSnapshot } from "../src/template/types";
import { buildSnapshot, readCredentials, SyncError } from "./atlassian";
import { getSyncConfig } from "./syncConfig";

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
