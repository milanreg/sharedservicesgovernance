import { runSync, syncErrorStatus } from "../../server/sync";

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

    try {
      return json(200, await runSync(slug, process.env));
    } catch (error) {
      return json(syncErrorStatus(error), { error: (error as Error).message });
    }
  },
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
