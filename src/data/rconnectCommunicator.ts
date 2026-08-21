import type {
  ArchitectureComponent,
  ConfigRow,
  DecisionRecord,
  DeploymentTarget,
  FlowStep,
  GanttItem,
  ImplementationNote,
  RoadmapPhase,
  Ticket,
} from "../template/types";

export const JIRA = "https://regnology-cloud.atlassian.net/browse";
export const BOARD =
  "https://regnology-cloud.atlassian.net/jira/software/c/projects/RCON/boards/3734/backlog";

export const CONFLUENCE = {
  phase2: "https://confluence.regnology.net/display/RCON/Phase+2+RSH",
  project: "https://confluence.regnology.net/display/RCON/Rconnect+Project",
};

export const SNAPSHOT = "21 Aug 2026";

export const sprint = {
  name: "Yolo - Communicator Sprint 21",
  id: 2986,
  start: "12 Aug 2026",
  end: "26 Aug 2026",
  board: 3734,
  goal: "Release RCON.C 1.2.0 on the sprint end date",
  /** Communicator issues only; the board reports 23 including four DataCalc tickets. */
  committed: 19,
  done: 1,
  inProgress: 4,
  blocked: 0,
};

export const sprintTickets: Ticket[] = [
  {
    key: "RCON-1380",
    summary: "Release RCON.C 1.2.0",
    status: "In Implementation",
    owner: "Ewa Grabowska",
    why: "The release itself is a sprint item, and its date is the sprint end date — there is no slack between finishing and shipping",
  },
  {
    key: "RCON-1357",
    summary: "Auto-grant IAM permissions from module registration (getCommunicationDimensions)",
    status: "In Implementation",
    owner: "Ewa Grabowska",
    why: "Removes manual IAM setup per module. A grant that fails must not leave registration in an ambiguous state",
  },
  {
    key: "RCON-1352",
    summary: "Use Valkey for shared cache of in-memory data (e.g. entities)",
    status: "In Implementation",
    owner: "Mateusz Uzarek",
    why: "Cacheable data still lives in process memory, which does not work across pods",
  },
  {
    key: "RCON-1213",
    summary: "Persist Case and Thread Change History in Database",
    status: "In Implementation",
    owner: "Ewa Grabowska",
    why: "Being built against a schema its own author marks provisional",
  },
  {
    key: "RCON-1304",
    summary: "Chart/wrapper: different modes of operation",
    status: "In PO Review",
    owner: "Mateusz Uzarek",
    why: "Wrapper chart has to enable or disable backend, internal UI and external UI independently",
  },
  {
    key: "RCON-1312",
    summary:
      "[Bug] App instance can crash on startup when several instances launch together on a fresh environment",
    status: "In PO Review",
    owner: "Mateusz Uzarek",
    why: "A restart clears it, but the ticket notes it could look like a real incident",
  },
  {
    key: "RCON-1297",
    summary:
      "[Bug] Reporting entity dropdown can show wrong module's entities when creating a case",
    status: "In PO Review",
    owner: "Ewa Grabowska",
    why: "Cross-module entity leakage at the point a case is created",
  },
  {
    key: "RCON-1296",
    summary: "[Bug] Thread list can show outdated unread counts when messages arrive close together",
    status: "In PO Review",
    owner: "Ewa Grabowska",
  },
  {
    key: "RCON-1295",
    summary: "[Bug] Navigating away from /cases quickly can bounce you back into a case",
    status: "In PO Review",
    owner: "Ewa Grabowska",
  },
  {
    key: "RCON-1287",
    summary: "Allow removing due date on cases and threads",
    status: "In PO Review",
    owner: "Ewa Grabowska",
    spillover: true,
    why: "Carried from sprint 20 with its UI refinement, RCON-1301",
  },
  {
    key: "RCON-1400",
    summary: "Communicator: Fix e2e tests after latest platform changes",
    status: "In PO Review",
    owner: "Ewa Grabowska",
    spillover: true,
    why: "The end-to-end suite is broken by platform changes and the fix has crossed two sprints",
  },
  {
    key: "RCON-1299",
    summary: "Clean up untagged images in Communicator dev Artifact Registry",
    status: "In PO Review",
    owner: "Ewa Grabowska",
    spillover: true,
  },
  {
    key: "RCON-1301",
    summary: "Refine UI for removing due date",
    status: "Done",
    owner: "Igor Lesiv",
    spillover: true,
    why: "The only item Done in this sprint",
  },
  {
    key: "RCON-1359",
    summary: "Fix registration purpose for group membership endpoint (getEntityGroupMemberships)",
    status: "Implemented",
    owner: "Agent RND Rconnect C Dev",
    spillover: true,
    why: "Delivered by an automated agent account under the RForge label, not by a named engineer",
  },
  {
    key: "RCON-1373",
    summary: "Communicator: Prepare example performance tests",
    status: "New",
    owner: "Unassigned",
    why: "No performance baseline exists ahead of the 1.2.0 release",
  },
  {
    key: "RCON-1399",
    summary: "Communicator: Design mockup for attachments UI",
    status: "New",
    owner: "Unassigned",
  },
  {
    key: "RCON-1398",
    summary: "Communicator: Design mockup for thread assignee UI",
    status: "New",
    owner: "Unassigned",
  },
  {
    key: "RCON-1397",
    summary: "Communicator: Design mockup for case and thread history UI",
    status: "New",
    owner: "Unassigned",
  },
  {
    key: "RCON-972",
    summary: "Support for filtering/sorting/pagination on backend side for the Dashboard table",
    status: "New",
    owner: "Unassigned",
    why: "The dashboard table still filters and sorts client-side",
  },
];

/** Sprint 20 — what actually reached a terminal state. */
export const previousSprintClosed: Ticket[] = [
  {
    key: "RCON-1291",
    summary: "Complete Rforge system onboarding for Communicator team",
    status: "Closed",
    owner: "Ewa Grabowska",
  },
  {
    key: "RCON-1301",
    summary: "Refine UI for removing due date",
    status: "Done",
    owner: "Igor Lesiv",
  },
  {
    key: "RCON-1359",
    summary: "Fix registration purpose for group membership endpoint (getEntityGroupMemberships)",
    status: "Implemented",
    owner: "Agent RND Rconnect C Dev",
  },
];

/**
 * Sprint 20's Ready for integration tail. Twenty of twenty-eight items, every
 * one unassigned, including the two that matter most for security.
 */
export const readyForIntegration: Ticket[] = [
  {
    key: "RCON-1290",
    summary: "Move dev Helm secrets from values file to Google Secret Manager",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "A database password and a Gemini API key are committed to git in the dev values file",
  },
  {
    key: "RCON-1300",
    summary: "External UI: F5 on case details fails with IAM redirect URI error",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "Reproduced on both dev and Marley, so it is the chart or the app — root cause not identified",
  },
  {
    key: "RCON-1383",
    summary: "Communicator: External Keycloak client setup uses internal client names",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "Unnoticed because every configuration so far happened to use the same names for both",
  },
  {
    key: "RCON-1351",
    summary: "Start entities refresh via IAM module-list polling instead of registration confirmation",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "A rolling update can leave the new pod with an empty entities list",
  },
  {
    key: "RCON-1344",
    summary: "Upgrade RSH Platform chart on dev and verify no breaking changes",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "Dev is pinned to platform 26.2.0; module registration, Keycloak, IAM and messaging all need re-verifying",
  },
  {
    key: "RCON-1303",
    summary: "Chart: external UI-only mode with configurable backend via proxy",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1353",
    summary: "Deliver Communicator sizing templates (modes × S/M/L, incl. Valkey) to Rcloud/Marley",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1288",
    summary: "Configure Marley staging for outbound email",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "Staging has no SMTP settings at all, so the email half of notifications cannot be exercised there",
  },
  {
    key: "RCON-1293",
    summary: "Document AI thread summary architecture and review MCP guidelines",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "The AI feature is in product; its architecture review is not owned",
  },
  {
    key: "RCON-1356",
    summary: "Limit white-labeling to header/footer chrome and emails (not page content)",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1350",
    summary: "Communicator: Overdue filter should exclude closed cases",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1348",
    summary: "Align public vs General thread terminology in UI and docs",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1347",
    summary: "[Bug] Hide Internal note checkbox on internal threads",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1308",
    summary: "[Bug] Case item options can belong to a previously selected entity",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1307",
    summary: "[Bug] Case actions can reflect the previously viewed case after fast navigation",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1272",
    summary: "Hide Rconnect Communicator module name on general messaging cases",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1264",
    summary: "Publishing documentation on RKH for Communicator",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1258",
    summary: "Communicator: Share file attachments in thread messages",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1374",
    summary: "Communicator: Align frontend with SonarQube for QG code coverage",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1177",
    summary: "Update OneUI version",
    status: "Ready for integration",
    owner: "Unassigned",
  },
];

export const epics = [
  { key: "RCON-758", title: "Communicator: Threads", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-777", title: "Communicator: Case View", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-779", title: "Communicator: Dashboard", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-778", title: "Communicator: General UI", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-781", title: "Communicator: Auth", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-720", title: "Communicator Technical Tasks", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-731", title: "Communicator Project Analysis & Management", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-920", title: "In-App & E-mail Notifications", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-922", title: "Internal-Only Threads", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-923", title: "Provide Feedback to Modules", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-921", title: "[Licensing Module] Migration of message chains from Vizor", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-977", title: "IAM Integration and Permission Reuse", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-1001", title: "Rcloud Readiness", status: "Ready for integration", owner: "Kamil Matuszewski" },
  { key: "RCON-924", title: "[Redesign] UI/UX Improvements", status: "In Implementation", owner: "Kamil Matuszewski" },
  { key: "RCON-1048", title: "Communicator Phase 2: Technical Tasks and Maintenance", status: "In Implementation", owner: "Kamil Matuszewski" },
  { key: "RCON-1113", title: "[PoC] AI Thread Summary", status: "New", owner: "Kamil Matuszewski" },
  { key: "RCON-1371", title: "Align AI Thread Summary with Regnology AI standards", status: "New", owner: "Kamil Matuszewski" },
  { key: "RCON-1370", title: "Native IAM permissions and group support", status: "New", owner: "Kamil Matuszewski" },
  { key: "RCON-1000", title: "Client Testing Feedback", status: "New", owner: "Unassigned" },
  { key: "RCON-1243", title: "Attachments", status: "New", owner: "Unassigned" },
  { key: "RCON-1161", title: "Case and Thread History", status: "New", owner: "Unassigned" },
  { key: "RCON-1165", title: "Thread-side assignee", status: "New", owner: "Unassigned" },
  { key: "RCON-1160", title: "Dynamic Context", status: "New", owner: "Unassigned" },
  { key: "RCON-1392", title: "Internal thread status and case status calculation", status: "New", owner: "Unassigned" },
  { key: "RCON-1257", title: "Communicator for Industry", status: "New", owner: "Unassigned" },
  { key: "RCON-1266", title: "Post Go-Live Features", status: "New", owner: "Unassigned" },
  { key: "RCON-1267", title: "Communicator onPrem", status: "New", owner: "Unassigned" },
];

export const consumers = [
  {
    name: "RSH Licensing module",
    key: "RCON-921",
    state: "Ready for integration",
    note: "Message chains migrated out of Vizor into Communicator threads",
  },
  {
    name: "Consuming modules generally",
    key: "RCON-923",
    state: "Ready for integration",
    note: "A module registers its communication dimensions and receives feedback on its cases",
  },
  {
    name: "Shared IAM platform",
    key: "RCON-977",
    state: "Ready for integration",
    note: "Permission reuse and mirroring today; RCON-1370 would make native IAM groups the source of truth",
  },
  {
    name: "Regnology Supervision Hub platform",
    key: "RCON-1344",
    state: "Ready for integration",
    note: "Chart pinned at 26.2.0; registration, Keycloak, IAM and messaging re-verify on every upgrade",
  },
  {
    name: "Rcloud / Marley",
    key: "RCON-1353",
    state: "Ready for integration",
    note: "Hosts the sizing templates and the pricing ingestion the chart modes feed",
  },
  {
    name: "Industry side (regulated firms)",
    key: "RCON-1257",
    state: "New",
    note: "External UI exists; Communicator for Industry as a product line is not started",
  },
];

export const layers = [
  { layer: "Product", key: "RCON-269", state: "In Progress" },
  { layer: "Rconnect for RSH", key: "RCON-276", state: "In Progress" },
  { layer: "Phase 1 (MVP)", key: "RCON-719", state: "Ready for integration · 7 epics" },
  {
    layer: "Phase 2 (Extended functionality)",
    key: "RCON-919",
    state: "In Implementation · 10 epics",
  },
  { layer: "Agentic AI features", key: "RCON-1104", state: "In Implementation · PoC in product" },
  { layer: "Phase 3 (Additional features)", key: "RCON-1159", state: "New · nothing staffed" },
];

export const architecture: {
  intro: string;
  components: ArchitectureComponent[];
  flow: FlowStep[];
  decisions: DecisionRecord[];
} = {
  intro:
    "Communicator is structured supervisory correspondence. A case carries threads, and a thread carries messages between the regulator and a regulated firm — or, when it is internal-only, between colleagues on one side. It runs on the Regnology Supervision Hub platform and takes identity, entities and permissions from the shared IAM service rather than owning them, which is why so much of its engineering is integration work rather than feature work.",
  components: [
    {
      component: "Communicator backend",
      responsibility:
        "Cases, threads, messages, followers, notification state, and change history. Registers itself as a module with the platform and holds the entity list it gets back.",
      technology: "Java · Spring Boot · PostgreSQL",
      owner: "Communicator squad",
    },
    {
      component: "Internal UI",
      responsibility: "The regulator-side application: dashboard, case view, threads, settings.",
      technology: "Angular · OneUI",
      owner: "Communicator squad",
    },
    {
      component: "External UI",
      responsibility:
        "The industry-side application for regulated firms. Deployable on its own, pointed at a backend through a proxy.",
      technology: "Angular · OneUI · nginx proxy",
      owner: "Communicator squad",
    },
    {
      component: "Valkey",
      responsibility:
        "Intended shared cache so entity data is not held per pod. Present in the chart and not yet used for caching.",
      technology: "Valkey",
      owner: "Communicator squad",
    },
    {
      component: "Keycloak and shared IAM",
      responsibility:
        "Authentication and the permission model. Separate internal and external clients, and a secondary IAM instance for the industry side.",
      technology: "Keycloak · Regnology IAM",
      owner: "Shared platform",
    },
    {
      component: "Platform messaging",
      responsibility:
        "Module registration and the exchange that tells Communicator which entities and dimensions a module owns.",
      technology: "NATS · platform-api 1.10.0",
      owner: "Shared platform",
    },
    {
      component: "AI thread summary",
      responsibility:
        "Summarises a thread the user can already see, suggests a reply, and advises whether the thread can be closed. Experimental, and already in product.",
      technology: "Gemini",
      owner: "Communicator squad",
    },
    {
      component: "Helm chart and wrapper",
      responsibility:
        "Deploys any combination of backend, internal UI and external UI, sized from a template.",
      technology: "Helm · Istio · GKE",
      owner: "Communicator squad · Rcloud",
    },
  ],
  flow: [
    {
      step: 1,
      title: "A module registers itself",
      detail:
        "A consuming module sends a registration message declaring its getCommunicationDimensions endpoint, its getEntityGroupMemberships endpoint, and the IAM permissions Communicator needs in order to call them.",
    },
    {
      step: 2,
      title: "Communicator grants itself the declared permissions",
      detail:
        "On successful registration it calls the IAM API to grant itself exactly what the module declared, so no one configures IAM by hand. A failed grant has to be logged clearly rather than leaving registration half-done.",
    },
    {
      step: 3,
      title: "Entities are pulled and kept fresh",
      detail:
        "Communicator reads the module's communication dimensions to learn its reporting entities. The refresh loop is moving from a registration confirmation event to polling the IAM module list, because a rolling update can leave a new pod waiting for a confirmation the old pod already consumed.",
    },
    {
      step: 4,
      title: "A case is opened against an entity",
      detail:
        "A case is scoped to a reporting entity and a module, and can carry a due date. Who may see it comes from IAM permissions, not from Communicator's own tables.",
    },
    {
      step: 5,
      title: "Threads carry the conversation",
      detail:
        "A general thread is visible to both sides. An internal-only thread is visible to one side, enabled per installation for each side independently, and deliberately has no status at all.",
    },
    {
      step: 6,
      title: "Followers are notified, in app then by email",
      detail:
        "Creating a thread or posting in it makes you a follower; anyone else can follow explicitly. A new thread broadcasts to everyone permitted to see the case, while messages and status changes go only to followers.",
    },
    {
      step: 7,
      title: "Email escalates only when in-app is ignored",
      detail:
        "An email is sent only if the in-app notification is still unread after a configured delay. Opening the thread by any route marks it read. Notifications never cross the confidentiality line into the other party.",
    },
    {
      step: 8,
      title: "Feedback returns to the module",
      detail:
        "Outcomes flow back to the module that owns the case, so the conversation is not stranded in Communicator.",
    },
  ],
  decisions: [
    {
      title: "Internal threads have no status — deliberately",
      detail:
        "Case status could not be computed sensibly once private threads existed: a case would read Open purely because an internal thread was open while every public thread was closed. Calculating case status from public threads only was considered and the simpler option won. The follow-up is written down and deferred — revisit when users report the due date staying lit on internal threads, and do not complicate it before then.",
      reference: { label: "RCON-922", href: `${JIRA}/RCON-922` },
    },
    {
      title: "Confidentiality outranks the notification design",
      detail:
        "The notification system must never send anything about an internal-only thread to a user from the opposing party, at any administrative level. This is stated as an absolute rule, not a preference, and it is the constraint every future notification channel inherits.",
      reference: { label: "RCON-920", href: `${JIRA}/RCON-920` },
    },
    {
      title: "Notifications only reach users who have logged in once",
      detail:
        "Recorded as an acknowledged system constraint rather than a defect. A supervisor who has never signed in cannot be told anything, which matters when a case is opened against a firm that has not yet onboarded.",
      reference: { label: "RCON-920", href: `${JIRA}/RCON-920` },
    },
    {
      title: "IAM should become the source of truth, not a mirror",
      detail:
        "Today Communicator reuses and mirrors permissions from IAM. RCON-1370 would add native IAM group support and make IAM primary, deprecating the Communicator-side mirroring for removal in a later release. Scope is explicitly to be refined after technical alignment, so the mirror stays for now.",
      reference: { label: "RCON-1370", href: `${JIRA}/RCON-1370` },
    },
    {
      title: "The chart ships three modes, not one topology",
      detail:
        "Backend with internal UI and external UI, backend with internal UI, or external UI only. The last was the missing mode; in it the backend target is configurable so requests go through a proxy rather than exposing the backend directly. Cross-namespace connectivity is called out as an operations concern the chart does not solve.",
      reference: { label: "RCON-1303", href: `${JIRA}/RCON-1303` },
    },
    {
      title: "White-labeling stops at the chrome",
      detail:
        "Header, footer and emails are customer-configurable through the Regulator 3 CSS variable pattern. Restyling the page body is explicitly out of scope — a deliberate limit on how far a customer may reshape the product.",
      reference: { label: "RCON-1356", href: `${JIRA}/RCON-1356` },
    },
    {
      title: "An AI feature shipped ahead of its governance",
      detail:
        "The Gemini-backed thread summary is described as an experimental proof of concept delivered in product. Aligning it with Regnology AI standards is a separate New epic, and the ticket to document its architecture and review it against MCP guidelines is unassigned. No ticket records what the proof of concept actually proved.",
      reference: { label: "RCON-1113", href: `${JIRA}/RCON-1113` },
    },
  ],
};

export const implementation: {
  intro: string;
  notes: ImplementationNote[];
  config: ConfigRow[];
} = {
  intro:
    "Phase 1 and Phase 2 are functionally complete and sitting at Ready for integration; what remains in flight is almost entirely platform and identity integration. Statuses are the Jira states in the 20 Aug 2026 snapshot. As with Submission, Ready for integration carries a resolution date, so the resolved figure is not a shipped figure.",
  notes: [
    {
      area: "Cases, threads and the dashboard",
      detail:
        "The Phase 1 core. Worth knowing for governance: these epics carry one-line descriptions and the Document issues linked to them are empty, so the domain model is not written down anywhere authoritative.",
      tickets: ["RCON-758", "RCON-777", "RCON-779", "RCON-778"],
      state: "Ready for integration",
    },
    {
      area: "Notifications",
      detail:
        "Dual channel with a follower model, per-trigger opt-outs enabled by default, email escalation only after an unread delay, and an absolute confidentiality rule. Mentions, assignee-based notification, digests and mobile push are explicitly out of scope.",
      tickets: ["RCON-920", "RCON-1288"],
      state: "Ready for integration · staging has no SMTP",
    },
    {
      area: "Internal-only threads",
      detail:
        "Both sides can hold a conversation their counterpart cannot see, enabled per installation per side. No status on internal threads, by decision. Cross-side isolation tests exist but have never been executed.",
      tickets: ["RCON-922", "RCON-1347", "RCON-1392"],
      state: "Ready for integration",
    },
    {
      area: "Vizor licensing migration",
      detail:
        "Message chains move out of Vizor into Communicator threads for the Licensing module — the migration that makes Communicator the place supervisory correspondence lives.",
      tickets: ["RCON-921", "RCON-923"],
      state: "Ready for integration",
    },
    {
      area: "IAM registration and permissions",
      detail:
        "Module registration declares the endpoints and the permissions Communicator needs, and Communicator grants itself those permissions. A wrong purpose on the group-membership endpoint has been fixed; the entity refresh is moving to polling because of a rolling-update race.",
      tickets: ["RCON-1357", "RCON-1359", "RCON-1351"],
      state: "In Implementation",
    },
    {
      area: "Internal versus external identity",
      detail:
        "Separate Keycloak clients and a secondary IAM instance for the industry side. External client setup currently reads internal client names — undetected because every configuration so far used the same names for both, which is allowed but not required.",
      tickets: ["RCON-1383", "RCON-1300"],
      state: "Ready for integration · redirect defect root cause unknown",
    },
    {
      area: "Chart modes and sizing",
      detail:
        "Three deployment modes in the base chart and the same switches in the wrapper, plus six sizing templates across two modes and three sizes. The templates are created ad hoc in the Rcloud UI rather than held in the wrapper repository.",
      tickets: ["RCON-1303", "RCON-1304", "RCON-1353"],
      state: "In Implementation",
    },
    {
      area: "Shared cache",
      detail:
        "Valkey is in the chart but unused. Entities and other cacheable data still live in process memory, which is wrong across pods; the work is to inventory each cache and decide keep or move.",
      tickets: ["RCON-1352"],
      state: "In Implementation",
    },
    {
      area: "Change history",
      detail:
        "Case and thread change history persisted in the database, with the UI mockup not yet designed. Being implemented against a schema its own author marks provisional.",
      tickets: ["RCON-1213", "RCON-1397", "RCON-1161"],
      state: "In Implementation",
    },
    {
      area: "Agentic AI",
      detail:
        "Thread summary with a suggested reply and closeability guidance, delivered as an experimental proof of concept. Standards alignment and the architecture and MCP review are separate, and the Gemini API key is one of the secrets currently committed to git.",
      tickets: ["RCON-1104", "RCON-1113", "RCON-1371", "RCON-1293"],
      state: "In product · governance outstanding",
    },
    {
      area: "Test and release engineering",
      detail:
        "The end-to-end suite is broken by platform changes, performance tests do not exist yet, and frontend coverage is not yet aligned with the quality gate. The 1.2.0 release is itself a sprint ticket due on the sprint end date.",
      tickets: ["RCON-1400", "RCON-1373", "RCON-1374", "RCON-1380"],
      state: "In Implementation",
    },
    {
      area: "Secrets and registries",
      detail:
        "A database password and the Gemini API key sit in a committed dev values file; the fix is Jenkins-injected credentials, though the ticket title says Google Secret Manager and its body says Jenkins. Untagged dev images also need clearing.",
      tickets: ["RCON-1290", "RCON-1299"],
      state: "Ready for integration · unassigned",
    },
  ],
  config: [
    {
      setting: "Chart mode",
      value: "backend + internal UI + external UI · backend + internal UI · external UI only",
      meaning:
        "Decides what a customer actually gets. External-UI-only points at a backend through a proxy instead of exposing it.",
    },
    {
      setting: "Internal vs external Keycloak client names",
      value: "separate values, may differ",
      meaning:
        "They are allowed to differ but every configuration so far has used the same names, which is why RCON-1383 went unnoticed.",
      warning: true,
    },
    {
      setting: "Notification delay before email",
      value: "application configuration",
      meaning:
        "The whole anti-noise design rests on this one value: email is sent only if the in-app notification is still unread when it expires.",
    },
    {
      setting: "Notification history length",
      value: "100 by default, configurable",
      meaning: "How far back the in-app panel reaches.",
    },
    {
      setting: "Internal threads per side",
      value: "per-installation switch, each side independently",
      meaning:
        "A deployment can give the regulator private threads without giving industry the same, or neither.",
    },
    {
      setting: "White-label CSS variables",
      value: "--oru-company-logo · --oru-brand-primary · --oru-brand-theme · --custom-header-color",
      meaning:
        "Header, footer and email chrome only. The page body is explicitly not restylable. The header colour is also used to tell Test from Production.",
    },
    {
      setting: "RSH Platform chart",
      value: "pinned 26.2.0 (README range >= 26.1.2, <= 26.2.0)",
      meaning:
        "Every upgrade needs module registration, Keycloak auth, IAM API and platform messaging re-verified.",
      warning: true,
    },
    {
      setting: "secrets: block in the dev values file",
      value: "database password and Gemini API key, in git",
      meaning:
        "Committed credentials. The replacement is Jenkins credential injection at deploy time.",
      warning: true,
    },
    {
      setting: "SMTP on Marley staging",
      value: "absent",
      meaning:
        "No host, port, auth or sender is configured, so email notifications cannot be tested on staging at all.",
      warning: true,
    },
    {
      setting: "Sizing templates",
      value: "2 modes × S/M/L, Valkey included",
      meaning:
        "Named by filename in the Marley dropdown and filtered by chart version; they also feed pricing.",
    },
  ],
};

export const deployment: {
  intro: string;
  targets: DeploymentTarget[];
  pipeline: string[];
} = {
  intro:
    "Communicator deploys as a Helm chart onto the Regnology Supervision Hub platform, in whichever of the three modes a customer needs, sized from a template that Rcloud also uses for pricing. The platform chart is pinned, so upgrades are a deliberate, verified step rather than a background event.",
  targets: [
    {
      environment: "Dev",
      topology: "full stack · primary RSH plus a secondary external IAM",
      state: "Live",
      note: "Keycloak, IAM, the app and a direct backend ingress each have their own dev hostname. Platform pinned at 26.2.0 and not yet upgraded.",
    },
    {
      environment: "Marley staging",
      topology: "Rcloud instance from a sizing template",
      state: "Live, incomplete",
      note: "No SMTP configured, so the email channel is unexercised. Sizing templates are created here by hand in the Rcloud UI.",
    },
    {
      environment: "Production — regulator side",
      topology: "backend + internal UI",
      state: "Release 1.2.0 in flight",
      note: "RCON.C 1.2.0 is due 26 Aug 2026, the same day the sprint ends.",
    },
    {
      environment: "Production — industry side",
      topology: "external UI only, backend via proxy",
      state: "Mode built, defect open",
      note: "Refreshing a case-details page after login fails with an IAM redirect URI error, reproduced on dev and staging both.",
    },
    {
      environment: "On premise",
      topology: "not defined",
      state: "New (RCON-1267)",
      note: "An epic exists with nothing behind it.",
    },
  ],
  pipeline: [
    "Pick the chart mode: backend with both UIs, backend with the internal UI, or the external UI alone.",
    "Pick a sizing template — mode crossed with small, medium or large, Valkey included — from the Marley dropdown filtered by chart version.",
    "Configure Keycloak clients for the internal and the external side, using each side's own client names rather than assuming they match.",
    "Deploy against a verified RSH platform version; today that is the pinned 26.2.0.",
    "Let the module register itself, then confirm Communicator granted itself the declared IAM permissions and populated its entity list.",
    "Configure SMTP so the email half of notifications works, with credentials in a Kubernetes secret rather than a ConfigMap.",
    "Apply white-label variables for header, footer and email chrome, and set the header colour that distinguishes Test from Production.",
    "Inject secrets from Jenkins credentials at deploy time rather than from a values file in git.",
  ],
};

export const roadmap: RoadmapPhase[] = [
  {
    phase: "Phase 1 — MVP",
    window: "Oct 2025 – early 2026",
    state: "Ready for integration",
    goal:
      "Stand up structured supervisory correspondence: cases, threads, a dashboard, a usable UI, and authentication.",
    items: [
      { key: "RCON-758", title: "Threads", status: "Ready for integration", note: "" },
      { key: "RCON-777", title: "Case View", status: "Ready for integration", note: "" },
      { key: "RCON-779", title: "Dashboard", status: "Ready for integration", note: "Backend paging still open as RCON-972" },
      { key: "RCON-778", title: "General UI", status: "Ready for integration", note: "" },
      { key: "RCON-781", title: "Auth", status: "Ready for integration", note: "Described only as Basic Auth" },
      { key: "RCON-720", title: "Technical tasks", status: "Ready for integration", note: "" },
    ],
    exit: [
      "A regulator and a firm can hold a threaded conversation against a case.",
      "The domain model is documented — the Document issues behind these epics are still empty.",
    ],
  },
  {
    phase: "Phase 2 — Extended functionality",
    window: "Feb – Aug 2026",
    state: "In Implementation",
    goal:
      "Make it deployable and trustworthy: notifications, private threads, module feedback, the Vizor migration, IAM reuse, and Rcloud readiness.",
    items: [
      { key: "RCON-920", title: "In-app and email notifications", status: "Ready for integration", note: "Confidentiality rule is absolute" },
      { key: "RCON-922", title: "Internal-only threads", status: "Ready for integration", note: "No status on internal threads, by decision" },
      { key: "RCON-923", title: "Provide feedback to modules", status: "Ready for integration", note: "" },
      { key: "RCON-921", title: "Vizor licensing message-chain migration", status: "Ready for integration", note: "" },
      { key: "RCON-977", title: "IAM integration and permission reuse", status: "Ready for integration", note: "Its three test issues have never been run" },
      { key: "RCON-1001", title: "Rcloud readiness", status: "Ready for integration", note: "" },
      { key: "RCON-924", title: "UI/UX redesign", status: "In Implementation", note: "" },
      { key: "RCON-1048", title: "Technical tasks and maintenance", status: "In Implementation", note: "Carries the chart, cache and secrets work" },
      { key: "RCON-1000", title: "Client testing feedback", status: "New", note: "Feedback loop with no content yet" },
    ],
    exit: [
      "RCON.C 1.2.0 released.",
      "Email notifications exercised somewhere other than a developer's laptop.",
      "Secrets out of git and the external redirect defect root-caused.",
      "The end-to-end suite green again.",
    ],
  },
  {
    phase: "Agentic AI",
    window: "May 2026 onward",
    state: "In product, ungoverned",
    goal:
      "Summarise a thread, suggest a reply, and advise whether it can be closed — then make that mechanism defensible.",
    items: [
      { key: "RCON-1113", title: "[PoC] AI thread summary", status: "New", note: "Experimental, and already in product" },
      { key: "RCON-1371", title: "Align with Regnology AI standards", status: "New", note: "Low priority" },
      { key: "RCON-1293", title: "Document architecture, review MCP guidelines", status: "Ready for integration", note: "Unassigned" },
      { key: "RCON-1114", title: "Improve UI of the PoC solution", status: "New", note: "" },
    ],
    exit: [
      "The architecture is written down and reviewed against the AI standards.",
      "The Gemini credential is out of source control.",
      "Someone records what the proof of concept actually proved.",
    ],
  },
  {
    phase: "Phase 3 — Additional features",
    window: "Late 2026 onward",
    state: "New",
    goal:
      "The backlog the product needs once it is live: attachments, history, assignees, and reach beyond the regulator side.",
    items: [
      { key: "RCON-1243", title: "Attachments", status: "New", note: "Sharing files in thread messages is separately at Ready for integration" },
      { key: "RCON-1161", title: "Case and thread history", status: "New", note: "Persistence in flight ahead of the UI" },
      { key: "RCON-1165", title: "Thread-side assignee", status: "New", note: "Explicitly out of scope for notifications today" },
      { key: "RCON-1160", title: "Dynamic context", status: "New", note: "" },
      { key: "RCON-1392", title: "Internal thread and case status calculation", status: "New", note: "The deferred half of the no-status decision" },
      { key: "RCON-1257", title: "Communicator for Industry", status: "New", note: "" },
      { key: "RCON-1266", title: "Post go-live features", status: "New", note: "" },
      { key: "RCON-1267", title: "Communicator onPrem", status: "New", note: "No design behind it" },
      { key: "RCON-1370", title: "Native IAM permissions and group support", status: "New", note: "Would deprecate Communicator-side mirroring" },
    ],
    exit: [
      "Nothing here should start while Phase 2 exit criteria are unmet.",
      "Design mockups exist before implementation — three are currently unassigned in the active sprint.",
    ],
  },
];

export const backlogGantt: GanttItem[] = [
  { id: "p1", label: "Phase 1 MVP", ticket: "RCON-719", start: "2025-10-14", end: "2026-03-31", status: "done", lane: "Phase 1" },
  { id: "threads", label: "Threads", ticket: "RCON-758", start: "2025-11-04", end: "2026-03-31", status: "done", lane: "Phase 1" },
  { id: "case", label: "Case view + dashboard", ticket: "RCON-777", start: "2025-11-04", end: "2026-04-30", status: "done", lane: "Phase 1" },
  { id: "p2", label: "Phase 2 extended functionality", ticket: "RCON-919", start: "2026-02-10", end: "2026-10-31", status: "active", lane: "Phase 2" },
  { id: "notif", label: "Notifications (in-app + email)", ticket: "RCON-920", start: "2026-02-10", end: "2026-09-30", status: "active", lane: "Phase 2" },
  { id: "internal", label: "Internal-only threads", ticket: "RCON-922", start: "2026-02-10", end: "2026-09-15", status: "active", lane: "Phase 2" },
  { id: "vizor", label: "Vizor licensing migration", ticket: "RCON-921", start: "2026-03-01", end: "2026-10-15", status: "active", lane: "Phase 2" },
  { id: "iam", label: "IAM integration + permission reuse", ticket: "RCON-977", start: "2026-04-01", end: "2026-11-30", status: "active", lane: "Identity" },
  { id: "reg", label: "Module registration + auto-grant", ticket: "RCON-1357", start: "2026-07-01", end: "2026-09-30", status: "active", lane: "Identity" },
  { id: "chart", label: "Chart modes + wrapper", ticket: "RCON-1304", start: "2026-06-01", end: "2026-10-31", status: "active", lane: "Platform" },
  { id: "valkey", label: "Valkey shared cache", ticket: "RCON-1352", start: "2026-07-15", end: "2026-10-15", status: "active", lane: "Platform" },
  { id: "rel12", label: "Release RCON.C 1.2.0", ticket: "RCON-1380", start: "2026-08-12", end: "2026-08-26", status: "active", lane: "Release" },
  { id: "secrets", label: "Secrets out of git", ticket: "RCON-1290", start: "2026-07-01", end: "2026-09-30", status: "blocked", lane: "Platform" },
  { id: "redirect", label: "External UI redirect defect", ticket: "RCON-1300", start: "2026-07-01", end: "2026-09-30", status: "blocked", lane: "Platform" },
  { id: "ai", label: "Agentic AI features", ticket: "RCON-1104", start: "2026-05-13", end: "2027-03-31", status: "active", lane: "AI" },
  { id: "aistd", label: "Align AI with Regnology standards", ticket: "RCON-1371", start: "2026-09-01", end: "2027-02-28", status: "planned", lane: "AI" },
  { id: "p3", label: "Phase 3 additional features", ticket: "RCON-1159", start: "2026-11-01", end: "2027-06-30", status: "planned", lane: "Phase 3" },
  { id: "attach", label: "Attachments", ticket: "RCON-1243", start: "2026-10-01", end: "2027-01-31", status: "planned", lane: "Phase 3" },
  { id: "hist", label: "Case and thread history", ticket: "RCON-1161", start: "2026-09-01", end: "2027-01-31", status: "planned", lane: "Phase 3" },
  { id: "industry", label: "Communicator for Industry", ticket: "RCON-1257", start: "2027-01-01", end: "2027-09-30", status: "later", lane: "Phase 3" },
  { id: "onprem", label: "Communicator onPrem", ticket: "RCON-1267", start: "2027-03-01", end: "2027-12-31", status: "later", lane: "Phase 3" },
];

export const stakeholderGantt: GanttItem[] = [
  { id: "lic", label: "Licensing module message chains out of Vizor", ticket: "RCON-921", start: "2026-03-01", end: "2026-10-15", status: "active", lane: "Consuming modules" },
  { id: "feedback", label: "Feedback to modules", ticket: "RCON-923", start: "2026-03-01", end: "2026-09-30", status: "active", lane: "Consuming modules" },
  { id: "iamshare", label: "Shared IAM permission reuse", ticket: "RCON-977", start: "2026-04-01", end: "2026-11-30", status: "active", lane: "Shared platform" },
  { id: "iamnative", label: "Native IAM groups, retire mirroring", ticket: "RCON-1370", start: "2026-11-01", end: "2027-06-30", status: "planned", lane: "Shared platform" },
  { id: "plat", label: "RSH platform upgrade past 26.2.0", ticket: "RCON-1344", start: "2026-08-01", end: "2026-11-30", status: "blocked", lane: "Shared platform" },
  { id: "rcloud", label: "Rcloud sizing templates and pricing", ticket: "RCON-1353", start: "2026-07-01", end: "2026-11-30", status: "active", lane: "Rcloud / Marley" },
  { id: "email", label: "Outbound email on staging", ticket: "RCON-1288", start: "2026-07-01", end: "2026-09-30", status: "blocked", lane: "Rcloud / Marley" },
  { id: "rel", label: "RCON.C 1.2.0 to customers", ticket: "RCON-1380", start: "2026-08-12", end: "2026-08-26", status: "active", lane: "Release" },
  { id: "client", label: "Client testing feedback loop", ticket: "RCON-1000", start: "2026-09-01", end: "2027-02-28", status: "planned", lane: "Consuming modules" },
  { id: "industry2", label: "Industry-side product line", ticket: "RCON-1257", start: "2027-01-01", end: "2027-09-30", status: "later", lane: "Consuming modules" },
];

/** Roles inferred from Jira ownership; the Confluence team table is mostly blank. */
export const stakeholders = [
  {
    name: "Kamil Matuszewski",
    role: "Product owner / epic owner",
    interest: "Every Communicator epic, the AI features, and the IAM direction",
    raci: "A",
    org: "Rconnect Communicator",
  },
  {
    name: "Anca Dobrea",
    role: "Portfolio owner",
    interest: "RCON-919 Phase 2 and RCON-925 extended functionality work packages",
    raci: "A (portfolio)",
    org: "Rconnect (R&D)",
  },
  {
    name: "Ewa Grabowska",
    role: "Engineer / release",
    interest: "Registration and permissions, change history, the 1.2.0 release, defect triage",
    raci: "R",
    org: "Rconnect Communicator",
  },
  {
    name: "Mateusz Uzarek",
    role: "Platform engineer",
    interest: "Chart modes, Valkey cache, startup crash",
    raci: "R (platform)",
    org: "Rconnect Communicator",
  },
  {
    name: "Igor Lesiv",
    role: "Front-end / UX",
    interest: "Due-date UI, proof-of-concept UI improvements",
    raci: "R",
    org: "Rconnect Communicator",
  },
  {
    name: "Agent RND Rconnect C Dev",
    role: "Automated agent account",
    interest: "Delivered RCON-1359 under the RForge label",
    raci: "R (automated)",
    org: "RForge",
  },
  {
    name: "Shared platform / IAM team",
    role: "Dependency",
    interest: "Module registration, Keycloak clients, IAM API, platform chart versions",
    raci: "C",
    org: "Regnology Supervision Hub Platform",
  },
  {
    name: "Rcloud / Marley team",
    role: "Dependency",
    interest: "Sizing templates, configuration templates, pricing ingestion, staging",
    raci: "C",
    org: "Rcloud",
  },
  {
    name: "Licensing module team",
    role: "First consuming module",
    interest: "Message chains migrated from Vizor, feedback on their cases",
    raci: "C",
    org: "Regnology Supervision Hub",
  },
  {
    name: "Regnology AI governance",
    role: "Approver, not yet engaged",
    interest: "AI thread summary standards alignment and architecture review",
    raci: "A (AI standards)",
    org: "Regnology",
  },
];

export const raciHeaders = [
  "Activity",
  "Matuszewski (PO)",
  "Dobrea (Portfolio)",
  "Communicator squad",
  "Shared platform / IAM",
  "Rcloud / Marley",
  "AI governance",
];

export const raciRows = [
  ["Product scope and phase gates", "A", "C", "I", "I", "I", "I"],
  ["Release RCON.C 1.2.0", "A", "I", "R", "C", "C", "I"],
  ["Module registration and permission grants", "A", "I", "R", "R", "I", "I"],
  ["Keycloak clients, internal and external", "C", "I", "R", "R", "I", "I"],
  ["Chart modes, sizing and pricing templates", "C", "I", "R", "I", "A", "I"],
  ["Notification confidentiality rules", "A", "C", "R", "I", "I", "I"],
  ["Secrets handling and dev credentials", "I", "I", "R", "C", "C", "I"],
  ["AI thread summary and its standards alignment", "R", "C", "R", "I", "I", "A"],
  ["Platform version upgrades", "C", "I", "R", "A", "I", "I"],
  ["Test coverage and end-to-end suite", "A", "I", "R", "I", "I", "I"],
];

export const rice = [
  {
    item: "Get secrets out of git",
    ticket: "RCON-1290",
    reach: 9,
    impact: 3,
    confidence: 0.9,
    effort: 1,
    why: "A database password and a Gemini API key are committed in a values file. Cheapest high-impact item on the board, and unassigned.",
    bottleneck: true,
  },
  {
    item: "Root-cause the external UI redirect failure",
    ticket: "RCON-1300",
    reach: 8,
    impact: 3,
    confidence: 0.7,
    effort: 2,
    why: "Refreshing a case page after login fails on the industry side. Reproduced on dev and staging, so it ships with the chart. Unassigned.",
    bottleneck: true,
  },
  {
    item: "Fix the external Keycloak client names",
    ticket: "RCON-1383",
    reach: 7,
    impact: 3,
    confidence: 0.9,
    effort: 1,
    why: "External setup reads internal client names. It works only because every configuration so far used identical names — the first customer that does not breaks.",
    bottleneck: true,
  },
  {
    item: "Configure outbound email on staging",
    ticket: "RCON-1288",
    reach: 8,
    impact: 2,
    confidence: 0.9,
    effort: 1,
    why: "Half of the notification design cannot be tested anywhere before a customer sees it.",
    bottleneck: true,
  },
  {
    item: "Entity refresh by polling",
    ticket: "RCON-1351",
    reach: 7,
    impact: 3,
    confidence: 0.8,
    effort: 2,
    why: "A routine rolling update can leave a pod serving an empty entity list, which looks like data loss to a supervisor.",
    bottleneck: true,
  },
  {
    item: "Repair the end-to-end suite",
    ticket: "RCON-1400",
    reach: 7,
    impact: 2,
    confidence: 0.8,
    effort: 2,
    why: "A release is due on the sprint end date with the suite red and no performance baseline.",
    bottleneck: true,
  },
  {
    item: "AI standards alignment and architecture review",
    ticket: "RCON-1371",
    reach: 6,
    impact: 3,
    confidence: 0.6,
    effort: 3,
    why: "The feature is already in front of users. The review ticket is unassigned and the alignment epic is Low priority and New.",
    bottleneck: true,
  },
  {
    item: "Valkey shared cache",
    ticket: "RCON-1352",
    reach: 6,
    impact: 2,
    confidence: 0.8,
    effort: 2,
    why: "Per-pod in-memory entity caches are wrong the moment there is more than one pod, which is always.",
  },
  {
    item: "Chart modes and sizing templates",
    ticket: "RCON-1304",
    reach: 6,
    impact: 2,
    confidence: 0.7,
    effort: 3,
    why: "How the product is sold and sized. Held back by templates that live in a UI rather than a repository.",
  },
  {
    item: "Platform upgrade past 26.2.0",
    ticket: "RCON-1344",
    reach: 5,
    impact: 2,
    confidence: 0.6,
    effort: 3,
    why: "Every month pinned is a larger, riskier upgrade later, and the integration surface to re-verify is the whole identity path.",
  },
];

export const bottlenecks = [
  {
    title: "Credentials committed to source control",
    ticket: "RCON-1290",
    detail:
      "The dev Helm values file carries a database password and a Gemini API key under a secrets block, in git. The fix is Jenkins-injected credentials at deploy time — the ticket title says Google Secret Manager while its body and acceptance criteria say Jenkins, and that contradiction is unresolved. Resolved as Ready for integration, and unassigned.",
  },
  {
    title: "An AI feature is in product ahead of its governance",
    ticket: "RCON-1113",
    detail:
      "The Gemini-backed thread summary suggests replies and advises whether a thread can be closed, and is described as an experimental proof of concept delivered in product. Aligning it with Regnology AI standards is a New, Low-priority epic; documenting its architecture and reviewing it against MCP guidelines is unassigned. No ticket records what the proof of concept proved.",
  },
  {
    title: "The industry side cannot survive a page refresh",
    ticket: "RCON-1300",
    detail:
      "On the external UI, pressing F5 on case details after logging in fails with an IAM redirect URI error. The internal UI is unaffected. It reproduces on both dev and Marley, so it is the chart or the application rather than one environment's IAM configuration, and the root cause has not been identified.",
  },
  {
    title: "Almost nothing is prioritised, and almost nothing is tested",
    ticket: "RCON-977",
    detail:
      "Across the platform and identity work, most items carry priority Not defined and none is above Low — including the startup crash and the redirect failure. Nearly every ticket is labelled NoTestRequired, including the IAM and authentication changes, and the three IAM test issues under RCON-977 have sat at Defined without being executed.",
  },
  {
    title: "A release is due the day the sprint ends",
    ticket: "RCON-1380",
    detail:
      "RCON.C 1.2.0 is dated 26 Aug 2026, the sprint end date, and the release is itself a sprint ticket. One item is Done, the end-to-end suite is broken by platform changes, and performance tests do not exist yet. There is no slack between finishing and shipping.",
  },
  {
    title: "Twenty of twenty-eight sprint-20 items are resolved and unowned",
    ticket: "RCON-1048",
    detail:
      "Sprint 20 closed with three items in a terminal state and twenty at Ready for integration, every one of them unassigned — including the secrets fix, the redirect defect, the Keycloak client-name bug, and the platform upgrade verification. This is where the product's real risk is parked.",
  },
  {
    title: "The sprint carries another product's work",
    ticket: "RCON-276",
    detail:
      "Four of the twenty-three items on the active Communicator sprint are ONADD DataCalc tickets — a Java upgrade, a CVE, a documentation theme, and a DataCalc release. The same people are committed to two products in one sprint, and the board's committed figure does not mean what it appears to.",
  },
  {
    title: "The domain model is not written down",
    ticket: "RCON-758",
    detail:
      "The Phase 1 epics that define cases, threads, the dashboard and the UI carry one-line descriptions, and the Document issues linked to them — marked Ready for delivery and Published — are empty. The decision record for internal-thread status is the exception rather than the rule.",
  },
  {
    title: "Configuration templates live in a UI, not a repository",
    ticket: "RCON-1353",
    detail:
      "Rcloud configuration templates are created ad hoc in the Rcloud UI, outside version control, in staging only, with a manual copy to production later if needed. The sizing templates they carry also feed the pricing tool.",
  },
  {
    title: "Platform pinned at 26.2.0 with the identity path unverified",
    ticket: "RCON-1344",
    detail:
      "Dev still runs the pinned RSH platform chart. The integration surface that must be re-verified on upgrade is exactly the fragile part: module registration, Keycloak authentication, the IAM API, and platform messaging. Unassigned.",
  },
];
