import { sprintSlices } from "../template/slices";
import type { TabId } from "../template/tabs";
import { riceScore, ticketHref, type ProjectGovernance, type Ticket } from "../template/types";
import { docReferences, docSet } from "./docs";
import { buildIndex, mentionedTicketKeys, search, type SearchIndex } from "./search";
import { buildPassages } from "./knowledge";

export type Tone = "red" | "amber" | "green";

export type AnswerItem = {
  title: string;
  detail?: string;
  href?: string;
  tone?: Tone;
};

export type AnswerBlock =
  | { kind: "text"; text: string }
  | { kind: "list"; items: AnswerItem[] };

export type AnswerSource = {
  label: string;
  href?: string;
  tab?: TabId;
};

export type Answer = {
  blocks: AnswerBlock[];
  sources: AnswerSource[];
};

/** Everything an intent needs, built once per project and reused per question. */
export type ChatBrain = {
  project: ProjectGovernance;
  index: SearchIndex;
  suggestions: string[];
};

export function buildBrain(project: ProjectGovernance): ChatBrain {
  return {
    project,
    index: buildIndex(buildPassages(project)),
    suggestions: suggestionsFor(project),
  };
}

function suggestionsFor(project: ProjectGovernance): string[] {
  const out = ["What is blocked?", "How are we doing?"];
  if (project.rice.length) out.push("What should we do first?");
  if (project.overview.roadmap.length) out.push("What is on the roadmap?");
  if (project.overview.architecture.components.length) out.push("How does the architecture work?");
  if (project.tickets.length) out.push(`Tell me about ${project.tickets[0].key}`);
  return out.slice(0, 5);
}

const text = (value: string): AnswerBlock => ({ kind: "text", text: value });
const list = (items: AnswerItem[]): AnswerBlock => ({ kind: "list", items });

function ticketTone(ticket: Ticket): Tone {
  if (ticket.blocked || ticket.risk?.level === "red") return "red";
  if (/closed|done|resolved/i.test(ticket.status)) return "green";
  return "amber";
}

function ticketItem(project: ProjectGovernance, ticket: Ticket): AnswerItem {
  return {
    title: `${ticket.key} — ${ticket.summary}`,
    detail: [
      `${ticket.status} · ${ticket.owner}`,
      ticket.blocked ? "blocked" : "",
      ticket.risk?.reason,
    ]
      .filter(Boolean)
      .join(" · "),
    href: ticketHref(project.ticketBaseUrl, ticket.key),
    tone: ticketTone(ticket),
  };
}

type Intent = {
  id: string;
  test: (question: string) => boolean;
  run: (brain: ChatBrain, question: string) => Answer | undefined;
};

const has = (question: string, ...words: string[]) =>
  words.some((word) => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(question));

const INTENTS: Intent[] = [
  {
    id: "help",
    test: (q) => /^(hi|hello|hey|help|what can you do|who are you)\b/.test(q),
    run: ({ project, suggestions }) => ({
      blocks: [
        text(
          `I answer questions about ${project.fullName} from this board's governance data — sprint state, tickets, risks, architecture, deployment, roadmap, stakeholders, and RICE priorities. Everything I say is quoted from that data, so I will tell you when something is not recorded rather than guess.`,
        ),
        list(suggestions.map((s) => ({ title: s }))),
      ],
      sources: [],
    }),
  },
  {
    id: "docs",
    test: (q) => has(q, "user guide", "documentation", "docs", "manual"),
    run: ({ project }) => {
      if (docSet(project.slug)) return undefined;
      const refs = docReferences(project.slug);
      if (!refs.length) return undefined;
      return {
        blocks: [
          text(
            `${project.name} user documentation is not snapshotted on this board yet — the live pages sit behind SSO, so I will not paraphrase them. Open the guide directly:`,
          ),
          list(refs.map((ref) => ({ title: ref.label, href: ref.url }))),
        ],
        sources: refs.map((ref) => ({ label: ref.label, href: ref.url })),
      };
    },
  },
  {
    id: "ticket",
    test: (q) => mentionedTicketKeys(q.toUpperCase()).length > 0,
    run: ({ project }, question) => {
      const keys = mentionedTicketKeys(question.toUpperCase());
      const found = keys
        .map((key) => project.tickets.find((ticket) => ticket.key === key))
        .filter((ticket): ticket is Ticket => Boolean(ticket));
      if (!found.length) return undefined;

      const blocks: AnswerBlock[] = [list(found.map((ticket) => ticketItem(project, ticket)))];
      for (const ticket of found) {
        const detail = [ticket.why, ticket.risk?.mitigation && `Mitigation: ${ticket.risk.mitigation}`]
          .filter(Boolean)
          .join(" ");
        if (detail) blocks.push(text(`${ticket.key}: ${detail}`));
      }
      return { blocks, sources: [{ label: "Sprint details", tab: "sprint" }] };
    },
  },
  {
    id: "blocked",
    test: (q) => has(q, "blocked", "blocker", "stuck", "bottleneck", "holding"),
    run: ({ project }) => {
      const blocked = project.tickets.filter((t) => t.blocked || t.risk?.level === "red");
      const blocks: AnswerBlock[] = [];

      blocks.push(
        text(
          blocked.length
            ? `${blocked.length} item${blocked.length === 1 ? " is" : "s are"} blocked or flagged red in ${project.sprint.name}.`
            : `Nothing in ${project.sprint.name} is currently marked blocked.`,
        ),
      );
      if (blocked.length) blocks.push(list(blocked.map((t) => ticketItem(project, t))));

      if (project.bottlenecks.length) {
        blocks.push(text("Structural bottlenecks recorded for this product:"));
        blocks.push(
          list(
            project.bottlenecks.map((b) => ({
              title: `${b.title} (${b.ticket})`,
              detail: b.detail,
              href: ticketHref(project.ticketBaseUrl, b.ticket),
              tone: b.risk?.level ?? "amber",
            })),
          ),
        );
      }
      return { blocks, sources: [{ label: "Sprint details", tab: "sprint" }, { label: "RACI & RICE", tab: "rice" }] };
    },
  },
  {
    id: "status",
    test: (q) =>
      has(q, "how are we", "how is it going", "overall status", "health", "on track", "rag", "summary", "status of the project"),
    run: ({ project }) => {
      const groups = sprintSlices(project.tickets);
      return {
        blocks: [
          text(
            `${project.fullName} is rated ${project.rag}${project.snapshot ? ` as of ${project.snapshot}` : ""}. ${project.sprint.headline ?? project.sprint.narrative}`,
          ),
          list([
            { title: `${groups.committed.length} committed`, detail: `Sprint ${project.sprint.name}` },
            { title: `${groups.done.length} done`, tone: "green" },
            { title: `${groups.wip.length} in progress`, tone: "amber" },
            { title: `${groups.integration.length} ready for integration`, tone: "amber" },
            { title: `${groups.attention.length} need attention`, tone: groups.attention.length ? "red" : "green" },
          ]),
          text(project.projectSummary.narrative),
        ],
        sources: [{ label: "Sprint details", tab: "sprint" }],
      };
    },
  },
  {
    id: "priority",
    test: (q) =>
      has(
        q,
        "first",
        "priority",
        "prioritise",
        "prioritize",
        "priorities",
        "most important",
        "rice",
        "what next",
        "focus",
      ),
    run: ({ project }) => {
      if (!project.rice.length) return undefined;
      const ranked = [...project.rice].sort((a, b) => riceScore(b) - riceScore(a)).slice(0, 6);
      const blocks: AnswerBlock[] = [
        text("Ranked by RICE score, highest value per unit of effort first:"),
        list(
          ranked.map((row, index) => ({
            title: `${index + 1}. ${row.item} (${row.ticket})`,
            detail: `RICE ${riceScore(row).toFixed(1)} · ${row.why}`,
            href: ticketHref(project.ticketBaseUrl, row.ticket),
            tone: row.bottleneck ? "red" : undefined,
          })),
        ),
      ];
      if (project.pmFocus.thisSprint.length) {
        blocks.push(text("This sprint the board calls out:"));
        blocks.push(list(project.pmFocus.thisSprint.map((line) => ({ title: line }))));
      }
      return { blocks, sources: [{ label: "RACI & RICE", tab: "rice" }] };
    },
  },
  {
    id: "roadmap",
    test: (q) => has(q, "roadmap", "phase", "when will", "timeline", "milestone", "delivery date", "eta"),
    run: ({ project }) => {
      if (!project.overview.roadmap.length) return undefined;
      return {
        blocks: [
          text(`Roadmap for ${project.name}, phase by phase:`),
          list(
            project.overview.roadmap.map((phase) => ({
              title: `${phase.phase} · ${phase.window}`,
              detail: `${phase.state}. ${phase.goal}${
                phase.items.length ? ` Items: ${phase.items.map((i) => i.key).join(", ")}.` : ""
              }`,
              tone: /done|complete/i.test(phase.state) ? "green" : undefined,
            })),
          ),
        ],
        sources: [{ label: "Product overview", tab: "overview" }, { label: "Product Gantt", tab: "backlog" }],
      };
    },
  },
  {
    id: "architecture",
    test: (q) =>
      has(
        q,
        "architect",
        "architecture",
        "how does it work",
        "component",
        "design",
        "tech stack",
        "technology",
        "login",
        "log in",
        "sign in",
        "authenticate",
        "authentication",
      ),
    run: ({ project }) => {
      const { architecture } = project.overview;
      if (!architecture.components.length && !architecture.intro) return undefined;
      const blocks: AnswerBlock[] = [];
      if (architecture.intro) blocks.push(text(architecture.intro));
      if (architecture.components.length) {
        blocks.push(
          list(
            architecture.components.map((c) => ({
              title: c.component,
              detail: `${c.responsibility} Built with ${c.technology}, owned by ${c.owner}.`,
            })),
          ),
        );
      }
      if (architecture.flow.length) {
        blocks.push(text("End to end, a request moves like this:"));
        blocks.push(
          list(architecture.flow.map((step) => ({ title: `${step.step}. ${step.title}`, detail: step.detail }))),
        );
      }
      return { blocks, sources: [{ label: "Product overview", tab: "overview" }] };
    },
  },
  {
    id: "deployment",
    test: (q) =>
      has(q, "deploy", "deployed", "deployment", "environment", "infrastructure", "hosted", "pipeline", "release process"),
    run: ({ project }) => {
      const { deployment } = project.overview;
      if (!deployment.targets.length && !deployment.intro) return undefined;
      const blocks: AnswerBlock[] = [];
      if (deployment.intro) blocks.push(text(deployment.intro));
      if (deployment.targets.length) {
        blocks.push(
          list(
            deployment.targets.map((target) => ({
              title: target.environment,
              detail: `${target.topology} · ${target.state}. ${target.note}`,
            })),
          ),
        );
      }
      if (deployment.pipeline.length) {
        blocks.push(text(`Pipeline: ${deployment.pipeline.join(" → ")}.`));
      }
      return { blocks, sources: [{ label: "Product overview", tab: "overview" }] };
    },
  },
  {
    id: "who",
    test: (q) => /\bwho\b/.test(q) || has(q, "owner", "responsible", "accountable", "contact"),
    run: ({ project, index }, question) => {
      const named = project.stakeholders.filter((person) => {
        const first = person.name.split(/\s+/)[0]?.toLowerCase() ?? "";
        return first.length > 3 && question.toLowerCase().includes(first);
      });
      const overall = /\bwho\s+(owns|is\s+(the\s+)?(owner|lead)|leads)\b/.test(question.toLowerCase());

      const people = named.length
        ? named
        : overall
          ? project.stakeholders.filter(
              (person) =>
                /\bA\b/.test(person.raci) || /^(initiative|product|engineering|tech)\b.*\b(owner|lead)/i.test(person.role),
            )
          : [];

      if (people.length) {
        return {
          blocks: [
            text(
              overall && !named.length
                ? `Accountable for ${project.name} on this board:`
                : `Matching people on ${project.name}:`,
            ),
            list(
              people.map((person) => ({
                title: person.name,
                detail: `${person.role}, ${person.org}. RACI ${person.raci}. ${person.interest}`,
              })),
            ),
          ],
          sources: [{ label: "Stakeholders", tab: "stakeholders" }],
        };
      }

      const hits = search(index, question, 4).filter((hit) => ["Stakeholders", "RACI"].includes(hit.passage.topic));
      if (!hits.length) return undefined;
      return {
        blocks: [list(hits.map((hit) => ({ title: hit.passage.title, detail: hit.passage.body })))],
        sources: [{ label: "Stakeholders", tab: "stakeholders" }],
      };
    },
  },
  {
    id: "spillover",
    test: (q) => has(q, "spillover", "spilled", "carry over", "carried over", "last sprint", "previous sprint"),
    run: ({ project }) => {
      const previous = project.previousSprint;
      const blocks: AnswerBlock[] = [
        text(`${previous.name} ran ${previous.dates}. ${previous.narrative}`),
      ];
      if (previous.leftover.length) {
        blocks.push(text("Carried into the current sprint:"));
        blocks.push(list(previous.leftover.map((t) => ticketItem(project, t))));
      }
      return { blocks, sources: [{ label: "Sprint spillovers", tab: "spillover" }] };
    },
  },
  {
    id: "counts",
    test: (q) => has(q, "how many", "count", "unassigned", "open issue", "total"),
    run: ({ project }) => {
      const summary = project.projectSummary;
      return {
        blocks: [
          list([
            { title: `${summary.done} done`, tone: "green" },
            { title: `${summary.open} open` },
            { title: `${summary.highPriorityOpen} open and high priority`, tone: "amber" },
            { title: `${summary.unassignedOpen} open and unassigned`, tone: summary.unassignedOpen ? "amber" : "green" },
            { title: `${summary.epics} epics` },
          ]),
          text(summary.narrative),
        ],
        sources: [{ label: "Jira project", href: summary.jiraUrl || undefined }],
      };
    },
  },
];

const NOT_FOUND =
  "I could not find that in this board's data. I only know what the governance payload and the synced Jira and Confluence records contain, so it may simply not be recorded yet.";

export function answer(brain: ChatBrain, question: string): Answer {
  const normalized = question.toLowerCase().trim();

  for (const intent of INTENTS) {
    if (!intent.test(normalized)) continue;
    const result = intent.run(brain, question);
    if (result) return withDocs(brain, result, normalized);
  }

  const hits = search(brain.index, question, 4).filter((hit) => hit.score >= 2);
  if (!hits.length) {
    return withDocs(brain, {
      blocks: [
        text(NOT_FOUND),
        text("Things I can answer right now:"),
        list(brain.suggestions.map((s) => ({ title: s }))),
      ],
      sources: [],
    }, normalized);
  }

  const [best, ...rest] = hits;
  const blocks: AnswerBlock[] = [text(best.passage.body)];
  if (rest.length) {
    blocks.push(text("Related on this board:"));
    blocks.push(
      list(
        rest.map((hit) => ({
          title: hit.passage.title,
          detail: hit.passage.body.length > 180 ? `${hit.passage.body.slice(0, 180)}…` : hit.passage.body,
          href: hit.passage.href,
        })),
      ),
    );
  }

  const sources: AnswerSource[] = [];
  for (const hit of hits) {
    if (sources.some((source) => source.label === hit.passage.topic)) continue;
    sources.push({ label: hit.passage.topic, href: hit.passage.href, tab: hit.passage.tab });
  }

  return withDocs(brain, { blocks, sources }, normalized);
}

/**
 * Documentation lives behind SSO, so when a question looks like docs territory
 * (or nothing on the board matched) the honest move is to name the page rather
 * than paraphrase something we have not read. Ingested pages are already
 * indexed and answer normally.
 */
function withDocs(brain: ChatBrain, result: Answer, question: string): Answer {
  if (docSet(brain.project.slug)) return result;
  const references = docReferences(brain.project.slug);
  if (!references.length) return result;
  const docsQuestion = has(question, "docs", "documentation", "guide", "how to", "how do", "user guide", "manual");
  if (!docsQuestion) return result;
  return {
    ...result,
    sources: [...result.sources, ...references.map((ref) => ({ label: ref.label, href: ref.url }))],
  };
}
