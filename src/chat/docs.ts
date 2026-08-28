/**
 * External product documentation, ingested rather than fetched at runtime.
 *
 * The Regnology docs site sits behind Okta, so the browser cannot read it and
 * neither can a deployed function. `npm run ingest:docs` snapshots the pages
 * while you are signed in and writes them here, the same way a Jira sync writes
 * src/data/live. Until that runs the reference links below still let an answer
 * point at the right page.
 */
export type DocSection = {
  heading: string;
  text: string;
};

export type DocPage = {
  title: string;
  url: string;
  sections: DocSection[];
};

export type DocSet = {
  slug: string;
  source: string;
  ingestedAt: string;
  pages: DocPage[];
};

const bundled = import.meta.glob<{ default: DocSet }>("../data/docs/*.json", { eager: true });

export function docSet(slug: string): DocSet | undefined {
  return bundled[`../data/docs/${slug}.json`]?.default;
}

/**
 * Authoritative pages for a product, known ahead of any ingest. The chat cites
 * these when a question is clearly documentation territory but nothing has been
 * snapshotted yet, so the user gets a destination instead of a dead end.
 */
export const DOC_REFERENCES: Record<string, { label: string; url: string }[]> = {
  iam: [
    {
      label: "IAM overview — Regnology user guide",
      url: "https://main.docs.dev.suptech.regnology.io/user-guide/iam/iam-overview/",
    },
  ],
};

export function docReferences(slug: string) {
  return DOC_REFERENCES[slug] ?? [];
}
