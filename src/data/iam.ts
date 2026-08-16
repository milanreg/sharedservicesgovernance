export const JIRA = "https://regnology-cloud.atlassian.net/browse";
export const BOARD =
  "https://regnology-cloud.atlassian.net/jira/software/c/projects/RSH/boards/2936";

export const CONFLUENCE = {
  offers:
    "https://confluence.regnology.net/spaces/RCON/pages/226552828/What+IAM+Service+Offers",
  auth: "https://confluence.regnology.net/spaces/VIZ/pages/266593053/IAM+-+Vizor+Authentication+and+Authorization",
  integration:
    "https://confluence.regnology.net/spaces/VIZ/pages/253473412/IAM+Integration",
  strategy: "https://confluence.regnology.net/pages/viewpage.action?pageId=194395208",
};

export const SNAPSHOT = "16 Aug 2026";

export const sprint = {
  name: "RSH PL 2616",
  id: 9056,
  start: "13 Aug 2026",
  end: "27 Aug 2026",
  board: 2936,
  committed: 16,
  done: 2,
  inProgress: 7,
  ready: 5,
  new: 2,
  blocked: 1,
  spillover: 6,
};

export type TicketStatus =
  | "Closed"
  | "In Quality Review"
  | "In Implementation"
  | "Ready"
  | "New"
  | "Ready for integration"
  | "PO Accepted";

export type Ticket = {
  key: string;
  summary: string;
  status: TicketStatus;
  owner: string;
  why?: string;
  blocked?: boolean;
  spillover?: boolean;
};

export const sprintTickets: Ticket[] = [
  {
    key: "RSH-4260",
    summary: "[IAM UI] Bug: Join Group dialog has no scroll when many groups are available",
    status: "Closed",
    owner: "Unassigned",
    why: "UX defect; duplicates join-groups pagination work",
  },
  {
    key: "RSH-3496",
    summary: "[IAM] Make view/manage roles entity-aware (vocabulary, model, parsing, FE)",
    status: "Closed",
    owner: "Celso Garcia",
    why: "Foundation for entity-scoped Principal User",
    spillover: true,
  },
  {
    key: "RSH-4220",
    summary:
      "[IAM] Bug: Users with View + Manage Permissions can edit their own permissions and escalate to Manage Users/Groups/Clients",
    status: "In Quality Review",
    owner: "Dominik Czerwiński",
    why: "Privilege escalation — go-live blocker for delegated admin",
  },
  {
    key: "RSH-3042",
    summary: "[IAM] Spike: Migrate users and groups to entity scoping",
    status: "In Quality Review",
    owner: "Shashank Prasad",
    why: "VAS effectivePermissions already assumes this model",
    spillover: true,
  },
  {
    key: "RSH-4251",
    summary: "IAM–Analyser integration issue",
    status: "In Implementation",
    owner: "Pawel Skrzypczynski",
    why: "Analytics consumer (RSH-719) cannot complete without this",
  },
  {
    key: "RSH-4066",
    summary: "[IAM] Restart keycloak pod automatically in the pipeline when needed",
    status: "In Implementation",
    owner: "Celso Garcia",
    why: "Dev-cluster stability for all module integrations",
  },
  {
    key: "RSH-3503",
    summary: "[IAM] Spike: Migrate existing IAM permissions to new version",
    status: "In Implementation",
    owner: "Shashank Prasad",
    why: "Companion to entity-scoping migration",
    spillover: true,
  },
  {
    key: "RSH-3481",
    summary:
      "[IAM] Direct group-id grant is a true OR-path (view/manage a specific group regardless of scope overlap)",
    status: "In Implementation",
    owner: "Celso Garcia",
    why: "Permission model correctness for scoped groups",
    spillover: true,
  },
  {
    key: "RSH-2453",
    summary: "Configure all modules to use IAM and Platform in Dev Cluster",
    status: "In Implementation",
    owner: "Pawel Skrzypczynski",
    why: "Integration proving ground for Vizor, Analytics, Rconnect",
    spillover: true,
  },
  {
    key: "RSH-4246",
    summary: "[IAM] Bug: User cannot assign Scoped permission from IAM Module to Scoped group",
    status: "Ready",
    owner: "Dominik Czerwiński",
    why: "Breaks scoped-group administration",
  },
  {
    key: "RSH-4244",
    summary:
      "[IAM] Bug: User can see Entity/Entity Groups for permission from assigned roles without Permission:Manage:<EntityId>",
    status: "Ready",
    owner: "Unassigned",
    why: "Authorization leak on entity visibility",
  },
  {
    key: "RSH-3763",
    summary: "[IAM] Provide join groups functionality with pagination and search",
    status: "Ready",
    owner: "Unassigned",
    why: "Replaces RSH-4260; Critical-priority UX",
  },
  {
    key: "RSH-2451",
    summary: "AppSec: OpenSSL issue in IAM API",
    status: "Ready",
    owner: "Adam Ennis",
    why: "Security debt sitting Ready across two sprints",
    spillover: true,
  },
  {
    key: "RSH-2169",
    summary: "[IAM] [Blocked] Entity group inheritance for entity access",
    status: "Ready",
    owner: "Unassigned",
    why: "VAS entityGroups contract cannot expand members — blocked on MDM",
    blocked: true,
  },
  {
    key: "RSH-4261",
    summary: "[IAM] Bug: Group delete failure exposes internal GUID in dialog and toast",
    status: "New",
    owner: "Unassigned",
    why: "Information leak in error UX",
  },
  {
    key: "RSH-3239",
    summary:
      "[IAM] Bug: Duplicate permissions can be added for the same user with identical roles and modules",
    status: "New",
    owner: "Unassigned",
    why: "Data integrity of the permission store",
  },
];

export const previousSprintClosed: Ticket[] = [
  {
    key: "RSH-4242",
    summary: "[IAM] Modules / Clients / Roles from ReachApi + final CleanUp",
    status: "Closed",
    owner: "Dominik Czerwiński",
  },
  {
    key: "RSH-3500",
    summary: "[IAM] Permissions view/manage: entity dimension on top of the module dimension",
    status: "Closed",
    owner: "Dominik Czerwiński",
  },
  {
    key: "RSH-3499",
    summary: "[IAM] Users view + manage reach from role context",
    status: "Closed",
    owner: "Zuzanna Twardowska",
  },
  {
    key: "RSH-3498",
    summary: "[IAM] Groups view + manage + create-scope reach from role context",
    status: "Closed",
    owner: "Dominik Czerwiński",
  },
  {
    key: "RSH-3497",
    summary: "[IAM] Derive caller reach from role entity context (reach API + [*]-marker de-overload)",
    status: "Closed",
    owner: "Dominik Czerwiński",
  },
  {
    key: "RSH-3479",
    summary: "[IAM] User creation with an optional initial permission",
    status: "Closed",
    owner: "Dominik Czerwiński",
  },
  {
    key: "RSH-3455",
    summary: "[IAM] Constrain the permission-modal context selector to the group's scope label",
    status: "Closed",
    owner: "Dominik Czerwiński",
  },
  {
    key: "RSH-3238",
    summary:
      "[IAM] Bug: Mirrored permission role value and module name case getting changed based on permission mirroring config map",
    status: "Closed",
    owner: "Shashank Prasad",
  },
];

export const leftoverFrom2615: Ticket[] = [
  {
    key: "RSH-3515",
    summary: "[IAM] Add RForge fixer scaffolding to supervisory-hub/iam",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RSH-3137",
    summary: "[IAM] Publish user-context ContextData routes in OpenAPI",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RSH-3478",
    summary: "[IAM] Restrict unscoped group visibility to unscoped principal users",
    status: "PO Accepted",
    owner: "Unassigned",
  },
];

export const phase2 = [
  { key: "RSH-1025", title: "Close Feature Gaps wrt R3/VIZ/eReg UM", status: "Closed", owner: "Adam Ennis" },
  { key: "RSH-1323", title: "Improvements 26.2.0.00", status: "Closed", owner: "Adam Ennis" },
  { key: "RSH-1488", title: "Required Endpoints for R3", status: "Closed", owner: "Adam Ennis" },
  { key: "RSH-1846", title: "Principal User (User Manager)", status: "In Implementation", owner: "Adam Ennis" },
  { key: "RSH-2150", title: "Permission Mirroring", status: "In Implementation", owner: "Adam Ennis" },
  { key: "RSH-793", title: "User Profile Management", status: "In Implementation", owner: "Adam Ennis" },
  { key: "RSH-4221", title: "IAM User Guide", status: "In Implementation", owner: "Kartik Sharma" },
  { key: "RSH-429", title: "Defects and Tech Debt — Backlog", status: "Ready", owner: "Adam Ennis" },
  { key: "RSH-794", title: "Translations", status: "Ready", owner: "Unassigned" },
  { key: "RSH-795", title: "Multi-Core IDP", status: "Ready", owner: "Unassigned" },
  { key: "RSH-4255", title: "Principal User — Make Work", status: "New", owner: "Unassigned" },
  { key: "RSH-4256", title: "WCAG 2.2 Level AA", status: "New", owner: "Unassigned" },
  { key: "RSH-4258", title: "User Profile Management — Improvements", status: "New", owner: "Unassigned" },
  { key: "RSH-4262", title: "PAT", status: "New", owner: "Jan-Hendrik Hühne" },
  { key: "RSH-4263", title: "Support for Third-Party Modules", status: "New", owner: "Unassigned" },
  { key: "RSH-321", title: "Support for Non-Standard IDPs", status: "New", owner: "Unassigned" },
  { key: "RSH-1314", title: "Support for Windows Server Deployments", status: "New", owner: "Unassigned" },
];

export const consumers = [
  { name: "RSH Licensing", key: "RSH-99", state: "Closed", note: "First production consumer" },
  { name: "R3 Data Collection", key: "RSH-718", state: "Closed", note: "Required endpoints shipped (RSH-1488)" },
  { name: "Vizor Licensing & AEOI", key: "REG-49745", state: "In Implementation", note: "IAM Integration doc v17 · AuthN/Z v62" },
  { name: "R3 × RSH Shared IAM", key: "REG-48802", state: "In Implementation", note: "Work package still open" },
  { name: "RSH Analytics", key: "RSH-719", state: "In Implementation", note: "Target 26.2 · blocked by RSH-4251" },
  { name: "Rconnect / CBBB", key: "RSH-2150", state: "In Implementation", note: "Permission mirroring is the Must/CBBB path" },
  { name: "RFS", key: "RFS-1688", state: "New", note: "Not scheduled" },
];

export type GanttItem = {
  id: string;
  label: string;
  ticket?: string;
  start: string;
  end: string;
  status: "done" | "active" | "planned" | "blocked" | "later";
  lane?: string;
};

export const backlogGantt: GanttItem[] = [
  { id: "auth", label: "Authentication foundation", ticket: "RSH-97", start: "2025-03-01", end: "2025-10-15", status: "done", lane: "Phase 1" },
  { id: "authz", label: "Authorization + module roles", ticket: "RSH-100", start: "2025-04-01", end: "2025-11-20", status: "done", lane: "Phase 1" },
  { id: "self", label: "User self-service", ticket: "RSH-105", start: "2025-06-01", end: "2026-01-31", status: "done", lane: "Phase 1" },
  { id: "pu", label: "Principal User", ticket: "RSH-1846", start: "2026-01-15", end: "2026-11-15", status: "active", lane: "Phase 2" },
  { id: "mirror", label: "Permission mirroring", ticket: "RSH-2150", start: "2026-02-01", end: "2026-09-30", status: "active", lane: "Phase 2" },
  { id: "scope", label: "Entity scoping migration", ticket: "RSH-3042", start: "2026-07-01", end: "2026-10-15", status: "active", lane: "Phase 2" },
  { id: "stab", label: "Stabilization / make-work", ticket: "RSH-4254", start: "2026-08-14", end: "2026-11-30", status: "planned", lane: "PL 26.3" },
  { id: "pu2", label: "Principal User — Make Work", ticket: "RSH-4255", start: "2026-09-01", end: "2026-12-18", status: "planned", lane: "PL 26.3" },
  { id: "inherit", label: "Entity-group inheritance", ticket: "RSH-2169", start: "2026-08-01", end: "2026-12-31", status: "blocked", lane: "Blocked" },
  { id: "pat", label: "Personal access tokens", ticket: "RSH-4262", start: "2027-01-08", end: "2027-03-31", status: "later", lane: "Later" },
  { id: "wcag", label: "WCAG 2.2 AA", ticket: "RSH-4256", start: "2027-01-15", end: "2027-04-30", status: "later", lane: "Later" },
  { id: "multicore", label: "Multi-Core IDP", ticket: "RSH-795", start: "2027-02-01", end: "2027-06-30", status: "later", lane: "Later" },
  { id: "win", label: "Windows Server deployments", ticket: "RSH-1314", start: "2027-03-01", end: "2027-08-15", status: "later", lane: "Later" },
];

export const stakeholderGantt: GanttItem[] = [
  { id: "lic", label: "RSH Licensing live on IAM", ticket: "RSH-99", start: "2025-06-01", end: "2025-12-15", status: "done", lane: "Shipped" },
  { id: "r3dc", label: "R3 Data Collection endpoints", ticket: "RSH-718", start: "2025-09-01", end: "2026-05-28", status: "done", lane: "Shipped" },
  { id: "vizor", label: "Vizor Portal + Supervision Centre", ticket: "REG-49745", start: "2025-10-10", end: "2026-12-15", status: "active", lane: "In market" },
  { id: "r3share", label: "R3 × RSH Shared IAM WP", ticket: "REG-48802", start: "2026-01-15", end: "2026-12-15", status: "active", lane: "In market" },
  { id: "cbbb", label: "Rconnect CBBB — mirrored permissions", ticket: "RSH-2150", start: "2026-03-01", end: "2026-11-30", status: "active", lane: "Must / CBBB" },
  { id: "an", label: "RSH Analytics 26.2", ticket: "RSH-719", start: "2026-04-01", end: "2026-10-31", status: "active", lane: "In market" },
  { id: "rfs", label: "RFS × RSH Shared IAM", ticket: "RFS-1688", start: "2027-01-08", end: "2027-06-30", status: "later", lane: "Unscheduled" },
];

export const stakeholders = [
  { name: "Robert Binder", role: "Initiative owner", interest: "RSH-96 Shared IAM · Scale (RSH-179)", raci: "A", org: "RSH Platform" },
  { name: "Adam Ennis", role: "Engineering lead", interest: "Phase 2 epics, AppSec, Principal User", raci: "R / A (delivery)", org: "RSH IAM" },
  { name: "Anke Dohse", role: "RTG / delivery governance", interest: "Staffing, onboarding FRR + hire", raci: "C", org: "Product ops" },
  { name: "Dominik Czerwiński", role: "IAM permissions / reach API", interest: "Privilege escalation, scoped groups", raci: "R", org: "RSH IAM" },
  { name: "Celso Garcia", role: "Entity-aware roles / Keycloak ops", interest: "RSH-3496, Keycloak restart, group-id grant", raci: "R", org: "RSH IAM" },
  { name: "Shashank Prasad", role: "Entity scoping / mirroring", interest: "RSH-3042, RSH-3503, mirroring bugs", raci: "R", org: "RSH IAM" },
  { name: "Pawel Skrzypczynski", role: "Platform integration", interest: "Dev cluster, Analyser, module rollout", raci: "R", org: "RSH Platform" },
  { name: "Kartik Sharma", role: "Documentation", interest: "IAM User Guide (RSH-4221)", raci: "R", org: "RSH IAM" },
  { name: "Jan-Hendrik Hühne", role: "PAT owner", interest: "RSH-4262 — later horizon", raci: "C", org: "RSH Platform" },
  { name: "Nico Romero", role: "Vizor AuthN/Z author", interest: "Confluence v62 (May 2026)", raci: "C", org: "Vizor" },
  { name: "Malachy Walsh", role: "IAM Integration author", interest: "Confluence v17 — undocumented gaps", raci: "C", org: "Vizor" },
  { name: "Iryna Shaban", role: "Rconnect IAM consumer", interest: "What IAM Service Offers · country in permissions", raci: "C", org: "Rconnect" },
  { name: "CBBB / Rconnect", role: "Customer forcing function", interest: "Mirrored permissions, not implicit ones", raci: "I / C", org: "External" },
];

export const raciRows = [
  ["Initiative strategy (RSH-96)", "A", "C", "I", "I", "C"],
  ["Sprint commitment & delivery", "I", "A", "R", "I", "I"],
  ["Principal User (RSH-1846 / 4255)", "A", "R", "R", "C", "C"],
  ["Permission mirroring / CBBB", "A", "R", "R", "C", "I"],
  ["Privilege-escalation & AppSec", "I", "A", "R", "I", "A"],
  ["Entity scoping / MDM inheritance", "C", "A", "R", "C", "I"],
  ["Vizor / R3 / Analytics integration", "C", "C", "R", "A", "I"],
  ["Consumer documentation", "I", "C", "R", "C", "I"],
];

export const raciHeaders = ["Activity", "Binder (PO)", "Ennis (Eng)", "IAM squad", "Product consumers", "AppSec"];

export const rice = [
  {
    item: "Privilege escalation fix",
    ticket: "RSH-4220",
    reach: 8,
    impact: 3,
    confidence: 0.9,
    effort: 1,
    why: "Touches every IAM tenant. In Quality Review. Highest near-term ROI and a PU prerequisite.",
    bottleneck: false,
  },
  {
    item: "Principal User",
    ticket: "RSH-1846",
    reach: 10,
    impact: 3,
    confidence: 0.7,
    effort: 5,
    why: "Kill-switch for Vizor/R3 local user management. Highest strategic ROI if entity scoping lands.",
    bottleneck: false,
  },
  {
    item: "Permission mirroring",
    ticket: "RSH-2150",
    reach: 6,
    impact: 3,
    confidence: 0.8,
    effort: 4,
    why: "CBBB / Rconnect Must. Revenue and client-satisfaction forcing function.",
    bottleneck: false,
  },
  {
    item: "Entity scoping migration",
    ticket: "RSH-3042",
    reach: 8,
    impact: 2,
    confidence: 0.75,
    effort: 4,
    why: "Unblocks Principal User. VAS contract already assumes this model.",
    bottleneck: false,
  },
  {
    item: "Dev-cluster module rollout",
    ticket: "RSH-2453",
    reach: 7,
    impact: 2,
    confidence: 0.7,
    effort: 3,
    why: "Proves integration for Vizor, Analytics, Rconnect before customer environments.",
    bottleneck: false,
  },
  {
    item: "Entity-group inheritance",
    ticket: "RSH-2169",
    reach: 5,
    impact: 2,
    confidence: 0.4,
    effort: 6,
    why: "Blocked on MDM. Do not staff until MDM membership is unblocked in writing.",
    bottleneck: true,
  },
  {
    item: "OpenSSL AppSec",
    ticket: "RSH-2451",
    reach: 8,
    impact: 2,
    confidence: 0.85,
    effort: 2,
    why: "Spillover Ready for two sprints. Cheap to close; looks bad if it sits.",
    bottleneck: false,
  },
  {
    item: "PAT / WCAG / Multi-Core",
    ticket: "RSH-4262",
    reach: 4,
    impact: 1,
    confidence: 0.55,
    effort: 8,
    why: "Platform completeness, not the next 90 days. Sequence after PU + hardening.",
    bottleneck: false,
  },
];

export function riceScore(row: (typeof rice)[number]) {
  return (row.reach * row.impact * row.confidence) / row.effort;
}

export const bottlenecks = [
  {
    title: "MDM entity-group membership",
    ticket: "RSH-2169",
    detail:
      "VAS entityGroups cannot expand members. Principal User and scoped permissions will lie about reach until MDM inheritance is explicit or deferred.",
  },
  {
    title: "Audience validation is off",
    ticket: "VAS config",
    detail:
      "VAS_IAM_INTERNAL_AUDIENCE / EXTERNAL default empty in known environments. Issuer auto-population needed a manual SQL fix-up in P5.8.1. Treat as go-live risk.",
  },
  {
    title: "Closed epic ≠ capability in market",
    ticket: "RSH-1025",
    detail:
      "Close Feature Gaps is Closed, then split into RSH-1846 and cloned as RSH-4255 Make Work. R3 Keycloak removal is still New.",
  },
  {
    title: "Integration doc gaps",
    ticket: "Confluence v17",
    detail:
      "External-user management, registration, migration, and managing VP users from Internal IAM are called out as undocumented or not supported.",
  },
  {
    title: "Stabilization vs strategy",
    ticket: "RSH-4254",
    detail:
      "RSH-96 is the strategy initiative (Amber, Jan 2026). RSH-4254 (14 Aug) is a maintenance epic whose stated goal is to get IAM actually working.",
  },
];

export const projects = [
  {
    slug: "iam",
    name: "IAM",
    full: "Identity and Access Management",
    rag: "Amber",
    summary: "Shared authentication and authorization for Regnology solutions. Foundations shipped; Principal User and mirroring still decide whether products retire local user management.",
    stats: ["634 [IAM] closed", "209 still open", "Sprint 2616 active"],
  },
  {
    slug: "rconnect-submission",
    name: "RCONNECT SUBMISSION",
    full: "Rconnect Submission",
    rag: "TBD",
    summary: "Submission flow across Rcloud / NiFi. Governance tabs will be added once the product briefing is connected.",
    stats: ["Portfolio card ready", "Tabs not yet wired"],
  },
  {
    slug: "rconnect-communicator",
    name: "RCONNECT COMMUNICATOR",
    full: "Rconnect Communicator",
    rag: "TBD",
    summary: "Supervisory messaging module. Governance tabs will be added once the product briefing is connected.",
    stats: ["Portfolio card ready", "Tabs not yet wired"],
  },
] as const;
