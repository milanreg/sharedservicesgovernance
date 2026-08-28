/**
 * Snapshots the Regnology product docs into src/data/docs so the board's
 * assistant can answer from them.
 *
 * The docs sit behind Okta, so there is no unattended way to read them: no
 * token exists that a build or a deployed function could use. Instead you lend
 * the script your already-authenticated session for one run, exactly the way
 * you would read the pages yourself.
 *
 *   1. Open the docs in your browser and sign in.
 *   2. DevTools → Application → Cookies → copy the _oauth2_proxy cookie value.
 *   3. $env:DOCS_COOKIE = "_oauth2_proxy=<value>"; npm run ingest:docs
 *
 * Output is committed like a Jira snapshot, so everyone else gets the content
 * without needing the cookie.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SLUG = process.env.DOCS_SLUG ?? "iam";
const ROOT = process.env.DOCS_ROOT ?? "https://main.docs.dev.suptech.regnology.io/user-guide/iam/";
const COOKIE = process.env.DOCS_COOKIE ?? "";
const MAX_PAGES = Number(process.env.DOCS_MAX_PAGES ?? 60);

if (!COOKIE) {
  console.error(
    "DOCS_COOKIE is not set. Sign in to the docs in your browser, copy the _oauth2_proxy\n" +
      "cookie from DevTools, then run:\n\n" +
      '  $env:DOCS_COOKIE = "_oauth2_proxy=<value>"; npm run ingest:docs\n',
  );
  process.exit(1);
}

const root = new URL(ROOT);

async function load(url) {
  const response = await fetch(url, {
    headers: { cookie: COOKIE, "user-agent": "iam-stat-docs-ingest" },
    redirect: "manual",
  });

  // The proxy bounces unauthenticated requests to Okta rather than returning 401.
  const location = response.headers.get("location") ?? "";
  if (response.status >= 300 && response.status < 400) {
    if (location.includes("portal.regnology.net") || location.includes("oauth2")) {
      throw new Error(
        "The docs site redirected to Okta, so the cookie is missing or expired. Sign in again and copy a fresh _oauth2_proxy value.",
      );
    }
    return { redirect: new URL(location, url).toString() };
  }

  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return { html: await response.text() };
}

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

const decode = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? " ");

const strip = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** Keeps the article body and drops chrome that would pollute every passage. */
function mainContent(html) {
  const withoutNoise = html
    .replace(/<(script|style|nav|header|footer|aside|svg)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  const article = withoutNoise.match(/<(?:article|main)\b[^>]*>([\s\S]*?)<\/(?:article|main)>/i);
  return article ? article[1] : withoutNoise;
}

function parse(html, url) {
  const body = mainContent(html);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? strip(titleMatch[1]).replace(/\s*[|·-]\s*Regnology.*$/i, "") : url;

  const sections = [];
  // Split on headings so a passage carries the heading it belongs under.
  const parts = body.split(/<h[1-4]\b[^>]*>/i);
  const headings = [...body.matchAll(/<h[1-4]\b[^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map((m) => strip(m[1]));

  parts.forEach((part, index) => {
    const text = strip(part.replace(/^[\s\S]*?<\/h[1-4]>/i, ""));
    if (text.length < 40) return;
    sections.push({ heading: index === 0 ? "" : (headings[index - 1] ?? ""), text });
  });

  const links = [...body.matchAll(/href="([^"#?]+)/gi)]
    .map((match) => {
      try {
        return new URL(match[1], url).toString();
      } catch {
        return "";
      }
    })
    .filter((href) => href.startsWith(root.origin + root.pathname));

  return { page: { title, url, sections }, links };
}

const seen = new Set();
const queue = [root.toString()];
const pages = [];

while (queue.length && pages.length < MAX_PAGES) {
  const url = queue.shift();
  const normalized = url.replace(/#.*$/, "");
  if (seen.has(normalized)) continue;
  seen.add(normalized);

  let result;
  try {
    result = await load(normalized);
  } catch (error) {
    console.error(`  skipped ${normalized}: ${error.message}`);
    if (/Okta/.test(error.message)) process.exit(1);
    continue;
  }

  if (result.redirect) {
    queue.push(result.redirect);
    continue;
  }

  const { page, links } = parse(result.html, normalized);
  if (page.sections.length) {
    pages.push(page);
    console.log(`  ${page.sections.length} sections · ${page.title}`);
  }
  for (const link of links) {
    if (!seen.has(link)) queue.push(link);
  }
}

if (!pages.length) {
  console.error("No readable pages were found. Check DOCS_ROOT points at a docs section.");
  process.exit(1);
}

const target = resolve(HERE, "..", "src", "data", "docs", `${SLUG}.json`);
await mkdir(dirname(target), { recursive: true });
await writeFile(
  target,
  `${JSON.stringify({ slug: SLUG, source: root.toString(), ingestedAt: new Date().toISOString(), pages }, null, 2)}\n`,
  "utf8",
);

const sections = pages.reduce((sum, page) => sum + page.sections.length, 0);
console.log(`\nWrote ${pages.length} pages (${sections} sections) to ${target}`);
console.log("Commit that file so the assistant has the docs without needing your cookie.");
