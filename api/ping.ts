/**
 * No imports and no logic. If this answers but a real endpoint does not, the
 * fault is in that endpoint rather than in how functions are built or routed.
 */
export default {
  fetch(): Response {
    return Response.json({ ok: true, runtime: process.version });
  },
};
