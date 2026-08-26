/**
 * The deployed board has no Vite process, so the Vite plugin's sync endpoint
 * does not exist there. This is the same sync behind a serverless function.
 *
 * Nothing is written to disk: the filesystem is read-only and per-invocation,
 * so a sync refreshes the open page and the committed snapshot stays the
 * baseline that every fresh load starts from.
 */
export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return json(405, { error: "Use POST." });
    }

    const slug = new URL(request.url).pathname.split("/").filter(Boolean).pop();
    if (!slug) {
      return json(400, { error: "No project slug in the request path." });
    }

    // Imported here rather than at module scope so a load failure comes back as
    // a readable message instead of an opaque platform-level crash.
    let sync: typeof import("../../server/sync");
    try {
      sync = await import("../../server/sync");
    } catch (error) {
      return json(500, {
        error: `The sync module failed to load on the server: ${describe(error)}`,
      });
    }

    try {
      return json(200, await sync.runSync(slug, process.env));
    } catch (error) {
      return json(sync.syncErrorStatus(error), { error: describe(error) });
    }
  },
};

function describe(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
