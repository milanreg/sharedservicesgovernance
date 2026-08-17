import type { TabId } from "./tabs";

export type { TabId };

export type Rag = "Green" | "Amber" | "Red" | "TBD";

export type RiskLevel = "red" | "amber";

export type RiskReference = {
  label: string;
  href: string;
};

export type Risk = {
  level: RiskLevel;
  reason: string;
  mitigation?: string;
  assessment?: string;
  references?: RiskReference[];
};

export type Ticket = {
  key: string;
  summary: string;
  status: string;
  owner: string;
  why?: string;
  blocked?: boolean;
  spillover?: boolean;
  risk?: Risk;
};

export type GanttItem = {
  id: string;
  label: string;
  ticket?: string;
  start: string;
  end: string;
  status: "done" | "active" | "planned" | "blocked" | "later";
  lane?: string;
};

export type Stakeholder = {
  name: string;
  role: string;
  org: string;
  raci: string;
  interest: string;
};

export type RiceItem = {
  item: string;
  ticket: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  why: string;
  bottleneck?: boolean;
};

export type Bottleneck = {
  title: string;
  ticket: string;
  detail: string;
  risk?: Risk;
};

export type LayerRow = {
  layer: string;
  key: string;
  state: string;
};

export type ConsumerRow = {
  name: string;
  key: string;
  state: string;
  note: string;
};

export type EpicRow = {
  key: string;
  title: string;
  owner: string;
  status: string;
};

/**
 * Canonical governance payload. Every project dashboard renders this shape.
 * Refactor ProjectDashboard when the layout must change; add a new dataset
 * when a product is connected.
 */
export type ProjectGovernance = {
  slug: string;
  name: string;
  fullName: string;
  rag: Rag;
  platform: string;
  summary: string;
  initiativeKey?: string;
  ticketBaseUrl: string;
  boardUrl?: string;
  snapshot: string;
  sources: string;
  populated: boolean;
  sprint: {
    name: string;
    start: string;
    end: string;
    committed: number;
    done: number;
    inProgress: number;
    blocked: number;
    narrative: string;
    headline?: string;
  };
  tickets: Ticket[];
  previousSprint: {
    name: string;
    dates: string;
    narrative: string;
    cards: { title: string; body: string }[];
    closed: Ticket[];
    leftover: Ticket[];
  };
  overview: {
    intro: string;
    callout: string;
    vision: string[];
    contract: string[];
    layers: LayerRow[];
    consumers: ConsumerRow[];
    epics: EpicRow[];
  };
  backlogGantt: {
    intro: string;
    items: GanttItem[];
    caption: string;
  };
  stakeholderGantt: {
    intro: string;
    highlights: { title: string; body: string }[];
    items: GanttItem[];
    caption: string;
  };
  stakeholders: Stakeholder[];
  raci: {
    headers: string[];
    rows: string[][];
  };
  rice: RiceItem[];
  bottlenecks: Bottleneck[];
  next90days?: string;
  projectSummary: {
    jiraUrl: string;
    done: number;
    open: number;
    highPriorityOpen: number;
    unassignedOpen: number;
    epics: number;
    currentRelease?: { name: string; date: string; released: boolean };
    lastRelease?: { name: string; date: string };
    narrative: string;
  };
  pmFocus: {
    thisSprint: string[];
    sequence: { order: number; item: string; ticket: string; why: string }[];
    questions: string[];
  };
};

export function riceScore(row: RiceItem) {
  return (row.reach * row.impact * row.confidence) / row.effort;
}

export function ticketHref(baseUrl: string, key: string) {
  return `${baseUrl.replace(/\/$/, "")}/${key}`;
}

export function emptyProject(
  partial: Pick<ProjectGovernance, "slug" | "name" | "fullName" | "summary" | "platform">,
): ProjectGovernance {
  return {
    ...partial,
    rag: "TBD",
    ticketBaseUrl: "https://regnology-cloud.atlassian.net/browse",
    snapshot: "",
    sources: "Governance briefing not yet connected.",
    populated: false,
    sprint: {
      name: "—",
      start: "",
      end: "",
      committed: 0,
      done: 0,
      inProgress: 0,
      blocked: 0,
      narrative: "Sprint data will appear here once this project is connected to Jira.",
    },
    tickets: [],
    previousSprint: {
      name: "—",
      dates: "",
      narrative: "Spillover analysis will appear here once two consecutive sprints are loaded.",
      cards: [],
      closed: [],
      leftover: [],
    },
    overview: {
      intro: "Product overview, Jira ticket map, and Confluence context will render in this tab.",
      callout: "",
      vision: [],
      contract: [],
      layers: [],
      consumers: [],
      epics: [],
    },
    backlogGantt: {
      intro: "Backlog Gantt will render from epics and versions once connected.",
      items: [],
      caption: "",
    },
    stakeholderGantt: {
      intro: "Integration roadmap will render from consuming-product tickets once connected.",
      highlights: [],
      items: [],
      caption: "",
    },
    stakeholders: [],
    raci: { headers: [], rows: [] },
    rice: [],
    bottlenecks: [],
    projectSummary: {
      jiraUrl: "",
      done: 0,
      open: 0,
      highPriorityOpen: 0,
      unassignedOpen: 0,
      epics: 0,
      narrative: "Project summary will appear here once Jira is connected.",
    },
    pmFocus: {
      thisSprint: [],
      sequence: [],
      questions: [],
    },
  };
}
