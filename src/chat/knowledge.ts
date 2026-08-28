import type { TabId } from "../template/tabs";
import { riceScore, ticketHref, type ProjectGovernance, type Risk } from "../template/types";
import { docSet } from "./docs";

/**
 * One retrievable fact about a product. The chat answers by finding passages
 * and quoting them, so every sentence a user reads traces back to the
 * governance payload or the ingested docs — nothing is generated.
 */
export type Passage = {
  id: string;
  /** Short source label shown under an answer, e.g. "Architecture". */
  topic: string;
  title: string;
  body: string;
  /** Terms worth matching that the body does not already say. */
  keywords?: string[];
  /** Tab holding the full detail, so an answer can deep-link to it. */
  tab?: TabId;
  href?: string;
};

/** Accepts anything so `list.length && "…"` guards read cleanly at call sites. */
const join = (parts: unknown[]) =>
  parts.filter((part): part is string => typeof part === "string" && part.trim() !== "").join(" ");

function riskProse(risk: Risk | undefined): string {
  if (!risk) return "";
  return join([
    `Flagged ${risk.level}: ${risk.reason}`,
    risk.mitigation && `Mitigation: ${risk.mitigation}`,
    risk.assessment && `Assessment: ${risk.assessment}`,
  ]);
}

/**
 * Flattens a governance payload into passages. Every branch of the payload is
 * covered deliberately: a question about deployment topology should not fall
 * back to the sprint narrative just because nobody indexed the deployment tab.
 */
export function buildPassages(project: ProjectGovernance): Passage[] {
  const out: Passage[] = [];
  const add = (passage: Passage) => {
    if (passage.body.trim()) out.push(passage);
  };
  const link = (key: string) => ticketHref(project.ticketBaseUrl, key);
  const { overview } = project;

  add({
    id: "identity",
    topic: "Product",
    title: `What ${project.name} is`,
    body: join([project.summary, overview.intro, overview.callout]),
    keywords: [project.fullName, project.platform, "purpose", "scope", "about", "overview"],
    tab: "overview",
  });

  add({
    id: "status",
    topic: "Status",
    title: "Overall delivery status",
    body: join([
      `${project.fullName} is rated ${project.rag}${project.snapshot ? ` as of ${project.snapshot}` : ""}.`,
      project.sprint.headline,
      project.projectSummary.narrative,
    ]),
    keywords: ["rag", "health", "on track", "how are we doing", "confidence", "overall"],
  });

  add({
    id: "sprint",
    topic: "Sprint",
    title: `Current sprint ${project.sprint.name}`,
    body: join([
      `Sprint ${project.sprint.name} runs ${project.sprint.start} to ${project.sprint.end}.`,
      `${project.sprint.committed} items committed, ${project.sprint.done} done, ${project.sprint.inProgress} in progress, ${project.sprint.blocked} blocked.`,
      project.sprint.narrative,
    ]),
    keywords: ["iteration", "this sprint", "current sprint", "commitment", "burndown"],
    tab: "sprint",
  });

  add({
    id: "counts",
    topic: "Jira",
    title: "Ticket counts and releases",
    body: join([
      `${project.projectSummary.done} issues are done and ${project.projectSummary.open} remain open across ${project.projectSummary.epics} epics.`,
      `${project.projectSummary.highPriorityOpen} open issues are high priority and ${project.projectSummary.unassignedOpen} are unassigned.`,
      project.projectSummary.currentRelease &&
        `Current release ${project.projectSummary.currentRelease.name} is dated ${project.projectSummary.currentRelease.date}.`,
      project.projectSummary.lastRelease &&
        `The last release was ${project.projectSummary.lastRelease.name} on ${project.projectSummary.lastRelease.date}.`,
    ]),
    keywords: ["how many", "total", "open issues", "backlog size", "unassigned", "release", "version"],
    href: project.projectSummary.jiraUrl || undefined,
  });

  for (const ticket of project.tickets) {
    add({
      id: `ticket-${ticket.key}`,
      topic: ticket.key,
      title: `${ticket.key} — ${ticket.summary}`,
      body: join([
        `${ticket.key} "${ticket.summary}" is in status ${ticket.status}, owned by ${ticket.owner}.`,
        ticket.why,
        ticket.blocked && "It is currently blocked.",
        ticket.spillover && "It spilled over from the previous sprint.",
        riskProse(ticket.risk),
      ]),
      keywords: [ticket.key, ticket.owner, ticket.status],
      href: link(ticket.key),
      tab: "sprint",
    });
  }

  add({
    id: "previous-sprint",
    topic: "Spillover",
    title: `Previous sprint ${project.previousSprint.name}`,
    body: join([
      `${project.previousSprint.name} ran ${project.previousSprint.dates}.`,
      project.previousSprint.narrative,
      project.previousSprint.leftover.length &&
        `Carried over: ${project.previousSprint.leftover.map((t) => t.key).join(", ")}.`,
      project.previousSprint.closed.length &&
        `Closed in that sprint: ${project.previousSprint.closed.map((t) => t.key).join(", ")}.`,
    ]),
    keywords: ["last sprint", "carry over", "carried", "spilled", "previous"],
    tab: "spillover",
  });

  for (const [index, card] of project.previousSprint.cards.entries()) {
    add({
      id: `spillover-${index}`,
      topic: "Spillover",
      title: card.title,
      body: `${card.title}. ${card.body}`,
      tab: "spillover",
    });
  }

  if (overview.vision.length) {
    add({
      id: "vision",
      topic: "Product",
      title: "Product vision",
      body: overview.vision.join(" "),
      keywords: ["vision", "goal", "ambition", "why", "strategy"],
      tab: "overview",
    });
  }

  if (overview.contract.length) {
    add({
      id: "contract",
      topic: "Product",
      title: "Integration contract",
      body: overview.contract.join(" "),
      keywords: ["contract", "interface", "api", "integrate", "consume"],
      tab: "overview",
    });
  }

  for (const layer of overview.layers) {
    add({
      id: `layer-${layer.key}`,
      topic: "Layers",
      title: `${layer.layer} layer`,
      body: `The ${layer.layer} layer is tracked under ${layer.key} and is ${layer.state}.`,
      keywords: [layer.key, "layer", "stack"],
      href: link(layer.key),
      tab: "overview",
    });
  }

  for (const consumer of overview.consumers) {
    add({
      id: `consumer-${consumer.key}`,
      topic: "Consumers",
      title: `${consumer.name} onboarding`,
      body: `${consumer.name} is ${consumer.state} under ${consumer.key}. ${consumer.note}`,
      keywords: [consumer.key, consumer.name, "consumer", "onboarding", "adopting", "tenant"],
      href: link(consumer.key),
      tab: "overview",
    });
  }

  for (const epic of overview.epics) {
    add({
      id: `epic-${epic.key}`,
      topic: "Epics",
      title: `${epic.key} — ${epic.title}`,
      body: `Epic ${epic.key} "${epic.title}" is ${epic.status} and owned by ${epic.owner}.`,
      keywords: [epic.key, epic.owner, "epic"],
      href: link(epic.key),
      tab: "overview",
    });
  }

  const { architecture, implementation, deployment } = overview;

  add({
    id: "architecture",
    topic: "Architecture",
    title: "Technical architecture",
    body: architecture.intro,
    keywords: ["architecture", "design", "technical", "how does it work", "system"],
    tab: "overview",
  });

  for (const component of architecture.components) {
    add({
      id: `component-${component.component}`,
      topic: "Architecture",
      title: component.component,
      body: `${component.component} ${component.responsibility} It is built with ${component.technology} and owned by ${component.owner}.`,
      keywords: [component.technology, component.owner, "component", "service"],
      tab: "overview",
    });
  }

  if (architecture.flow.length) {
    add({
      id: "flow",
      topic: "Architecture",
      title: "Request flow",
      body: architecture.flow.map((step) => `${step.step}. ${step.title}: ${step.detail}`).join(" "),
      keywords: ["flow", "sequence", "request", "token", "login", "end to end"],
      tab: "overview",
    });
  }

  for (const [index, decision] of architecture.decisions.entries()) {
    add({
      id: `decision-${index}`,
      topic: "Decisions",
      title: decision.title,
      body: `${decision.title}. ${decision.detail}`,
      keywords: ["decision", "why did we", "trade off", "chose", "adr"],
      href: decision.reference?.href,
      tab: "overview",
    });
  }

  add({
    id: "implementation",
    topic: "Implementation",
    title: "Implementation status",
    body: implementation.intro,
    keywords: ["implementation", "progress", "built", "delivered so far"],
    tab: "overview",
  });

  for (const note of implementation.notes) {
    add({
      id: `impl-${note.area}`,
      topic: "Implementation",
      title: note.area,
      body: join([
        `${note.area}: ${note.detail}`,
        `State: ${note.state}.`,
        note.tickets.length && `Tracked by ${note.tickets.join(", ")}.`,
      ]),
      keywords: [...note.tickets, note.state, note.area],
      tab: "overview",
    });
  }

  for (const row of implementation.config) {
    add({
      id: `config-${row.setting}`,
      topic: "Configuration",
      title: row.setting,
      body: join([
        `${row.setting} is set to ${row.value}. ${row.meaning}`,
        row.warning && "This setting is flagged as a risk.",
      ]),
      keywords: ["config", "setting", "property", "flag", "parameter", row.setting],
      tab: "overview",
    });
  }

  add({
    id: "deployment",
    topic: "Deployment",
    title: "Deployment architecture",
    body: join([
      deployment.intro,
      deployment.pipeline.length && `Pipeline: ${deployment.pipeline.join(" → ")}.`,
    ]),
    keywords: ["deploy", "deployment", "environment", "pipeline", "release process", "infrastructure"],
    tab: "overview",
  });

  for (const target of deployment.targets) {
    add({
      id: `target-${target.environment}`,
      topic: "Deployment",
      title: `${target.environment} environment`,
      body: `${target.environment} runs ${target.topology} and is ${target.state}. ${target.note}`,
      keywords: [target.environment, "environment", "cluster", "hosting"],
      tab: "overview",
    });
  }

  for (const phase of overview.roadmap) {
    add({
      id: `phase-${phase.phase}`,
      topic: "Roadmap",
      title: `${phase.phase} (${phase.window})`,
      body: join([
        `${phase.phase} runs ${phase.window} and is ${phase.state}. Goal: ${phase.goal}`,
        phase.items.length &&
          `Items: ${phase.items.map((item) => `${item.key} ${item.title} (${item.status})`).join("; ")}.`,
        phase.exit.length && `Exit criteria: ${phase.exit.join("; ")}.`,
      ]),
      keywords: ["roadmap", "phase", "when", "timeline", "next", phase.phase, phase.window],
      tab: "overview",
    });
  }

  add({
    id: "backlog-gantt",
    topic: "Product Gantt",
    title: "Delivery timeline",
    body: join([project.backlogGantt.intro, project.backlogGantt.caption]),
    keywords: ["gantt", "timeline", "schedule", "dates", "plan"],
    tab: "backlog",
  });

  for (const item of project.backlogGantt.items) {
    add({
      id: `gantt-${item.id}`,
      topic: "Product Gantt",
      title: item.label,
      body: join([
        `${item.label} is scheduled ${item.start} to ${item.end} and is ${item.status}.`,
        item.ticket && `Tracked by ${item.ticket}.`,
        item.lane && `Lane: ${item.lane}.`,
      ]),
      keywords: [item.ticket ?? "", "when", "date", "scheduled", "delivery"],
      href: item.ticket ? link(item.ticket) : undefined,
      tab: "backlog",
    });
  }

  add({
    id: "integration-gantt",
    topic: "Integration",
    title: "Integration timeline",
    body: join([project.stakeholderGantt.intro, project.stakeholderGantt.caption]),
    keywords: ["integration", "adoption", "consumers", "rollout"],
    tab: "value",
  });

  for (const [index, highlight] of project.stakeholderGantt.highlights.entries()) {
    add({
      id: `integration-highlight-${index}`,
      topic: "Integration",
      title: highlight.title,
      body: `${highlight.title}. ${highlight.body}`,
      tab: "value",
    });
  }

  for (const person of project.stakeholders) {
    add({
      id: `stakeholder-${person.name}`,
      topic: "Stakeholders",
      title: person.name,
      body: `${person.name} is ${person.role} in ${person.org}, RACI ${person.raci}. Interest: ${person.interest}`,
      keywords: [person.name, person.role, person.org, "who", "contact", "owner", "responsible"],
      tab: "stakeholders",
    });
  }

  for (const row of project.raci.rows) {
    if (!row.length) continue;
    const detail = project.raci.headers
      .slice(1)
      .map((header, index) => `${header}: ${row[index + 1] ?? "—"}`)
      .join(", ");
    add({
      id: `raci-${row[0]}`,
      topic: "RACI",
      title: row[0],
      body: `For ${row[0]}, ${detail}.`,
      keywords: ["raci", "accountable", "responsible", "consulted", "informed", "who decides", ...row],
      tab: "rice",
    });
  }

  const ranked = [...project.rice].sort((a, b) => riceScore(b) - riceScore(a));
  if (ranked.length) {
    add({
      id: "rice-ranking",
      topic: "RICE",
      title: "Priority order by RICE",
      body: `Ranked by RICE score: ${ranked
        .map((row, index) => `${index + 1}. ${row.item} (${row.ticket}, ${riceScore(row).toFixed(1)})`)
        .join("; ")}.`,
      keywords: ["priority", "prioritise", "prioritize", "most important", "rice", "ranking", "first"],
      tab: "rice",
    });
  }

  for (const row of project.rice) {
    add({
      id: `rice-${row.ticket}`,
      topic: "RICE",
      title: `${row.item} (${row.ticket})`,
      body: join([
        `${row.item} scores ${riceScore(row).toFixed(1)} on RICE: reach ${row.reach}, impact ${row.impact}, confidence ${row.confidence}, effort ${row.effort}.`,
        row.why,
        row.bottleneck && "It is called out as a bottleneck.",
      ]),
      keywords: [row.ticket, "rice", "score", "value", "effort"],
      href: link(row.ticket),
      tab: "rice",
    });
  }

  for (const bottleneck of project.bottlenecks) {
    add({
      id: `bottleneck-${bottleneck.ticket}`,
      topic: "Bottleneck",
      title: bottleneck.title,
      body: join([
        `${bottleneck.title} (${bottleneck.ticket}): ${bottleneck.detail}`,
        riskProse(bottleneck.risk),
      ]),
      keywords: [bottleneck.ticket, "bottleneck", "blocker", "stuck", "slow", "constraint", "risk"],
      href: link(bottleneck.ticket),
      tab: "rice",
    });
  }

  if (project.pmFocus.thisSprint.length) {
    add({
      id: "pm-focus",
      topic: "PM focus",
      title: "What needs attention now",
      body: project.pmFocus.thisSprint.join(" "),
      keywords: ["focus", "attention", "action", "what should i do", "next steps", "todo"],
      tab: "sprint",
    });
  }

  for (const step of project.pmFocus.sequence) {
    add({
      id: `sequence-${step.order}`,
      topic: "Sequencing",
      title: `${step.order}. ${step.item}`,
      body: `Step ${step.order} is ${step.item} (${step.ticket}). ${step.why}`,
      keywords: [step.ticket, "order", "sequence", "first", "next", "dependency"],
      href: link(step.ticket),
      tab: "sprint",
    });
  }

  if (project.pmFocus.questions.length) {
    add({
      id: "open-questions",
      topic: "Open questions",
      title: "Unresolved questions",
      body: project.pmFocus.questions.join(" "),
      keywords: ["question", "unknown", "unclear", "decide", "open issue"],
      tab: "sprint",
    });
  }

  if (project.next90days) {
    add({
      id: "next-90",
      topic: "Roadmap",
      title: "Next 90 days",
      body: project.next90days,
      keywords: ["next 90", "coming", "upcoming", "quarter"],
    });
  }

  if (project.activity) {
    const activity = project.activity;
    add({
      id: "activity",
      topic: "Recent activity",
      title: `Movement over ${activity.days} days`,
      body: join([
        `${activity.delivered.total} issues were delivered and ${activity.raised.total} raised in the last ${activity.days} days.`,
        `${activity.due.total} are due in the next ${activity.days} days and ${activity.stalled.total} are stalled.`,
        activity.overdueReleases.length &&
          `Overdue releases: ${activity.overdueReleases.map((r) => `${r.name} (${r.date})`).join(", ")}.`,
      ]),
      keywords: ["recent", "last 30 days", "delivered", "raised", "stalled", "due", "activity", "velocity"],
    });
  }

  for (const doc of project.confluenceDocs ?? []) {
    add({
      id: `confluence-${doc.title}`,
      topic: "Confluence",
      title: doc.title,
      body: `Confluence page "${doc.title}" was last updated ${doc.updated}${doc.version ? ` at version ${doc.version}` : ""}.`,
      keywords: ["confluence", "document", "page", "spec", "wiki"],
      href: doc.url,
    });
  }

  add({
    id: "sources",
    topic: "Provenance",
    title: "Where this data comes from",
    body: join([project.sources, project.snapshot && `Snapshot taken ${project.snapshot}.`]),
    keywords: ["source", "where from", "data", "accurate", "updated", "sync"],
  });

  const docs = docSet(project.slug);
  for (const page of docs?.pages ?? []) {
    for (const [index, section] of page.sections.entries()) {
      add({
        id: `doc-${page.url}-${index}`,
        topic: "Product docs",
        title: section.heading ? `${page.title} — ${section.heading}` : page.title,
        body: section.text,
        keywords: ["docs", "documentation", "user guide", "how to"],
        href: page.url,
      });
    }
  }

  return out;
}
