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
  product: "https://confluence.regnology.net/spaces/RCON/pages/271223446/Rconnect+Submission",
  adrs: "https://confluence.regnology.net/spaces/RCON/pages/274800732/ADRs",
  component:
    "https://confluence.regnology.net/spaces/RCON/pages/274799233/Rconnect+as+a+component",
  integration:
    "https://confluence.regnology.net/spaces/RCON/pages/293881399/Rconnect+integration+guide",
  nifi: "https://confluence.regnology.net/spaces/RCON/pages/299214127/NiFi+integration+guide",
  security:
    "https://confluence.regnology.net/spaces/RCON/pages/307763856/Security+vulnerabilities",
  guidelines:
    "https://confluence.regnology.net/spaces/RCON/pages/271223023/Development+Guidelines",
  deployProd:
    "https://confluence.regnology.net/spaces/RCON/pages/274799332/Deploy+as+a+component+on+PROD",
};

export const SNAPSHOT = "19 Aug 2026";

export const sprint = {
  name: "RCON.S sprint 14",
  id: 2947,
  start: "10 Aug 2026",
  end: "21 Aug 2026",
  board: 3734,
  goal: "Internal Production Release · UI/UX flow update",
  committed: 15,
  done: 0,
  // Implementation only. The two In PO Review items count as waiting, not in flight.
  inProgress: 9,
  blocked: 0,
};

/** RCON.S sprint 14 as at 19 Aug 2026 — two days before the sprint closes. */
export const sprintTickets: Ticket[] = [
  {
    key: "RCON-1366",
    summary: "[BE] Differentiate TEST/PROD submissions by parsing the FiTax file name",
    status: "In Implementation",
    owner: "Benjamin Garaude",
    why: "Critical. TEST and PROD CESOP submissions are told apart only by the TestProd segment of the FiTax exchange file name",
  },
  {
    key: "RCON-1381",
    summary: "[Ni-FI] Differentiate TEST/PROD submissions by parsing the FiTax file name",
    status: "In Implementation",
    owner: "CE-Alexandru Calinescu",
    why: "NiFi half of RCON-1366; the flow and the backend have to agree or a test file reaches a live authority",
  },
  {
    key: "RCON-902",
    summary: "[BE] [Error Handling NiFi] Add an information of error reason",
    status: "In Implementation",
    owner: "CE-Dwitiya Halder",
    why: "Carry-over. Without a reason on the failure, every NiFi error looks the same to a supervisor",
  },
  {
    key: "RCON-1382",
    summary: "[Ni-FI] [Error Handling NiFi] Add an information of error reason",
    status: "New",
    owner: "CE-Dwitiya Halder",
    why: "NiFi half of RCON-902, still New with the sprint closing",
  },
  {
    key: "RCON-1336",
    summary: "RTH - RCON Integration to add RCON as independent component",
    status: "In Implementation",
    owner: "Benjamin Garaude",
    why: "First integrator on the standalone model from ADR-0006 rather than a subchart of the parent app",
  },
  {
    key: "RCON-1173",
    summary: "Create instance to integrate Nifi-registry updater",
    status: "In Implementation",
    owner: "Vinodh Soundararajan",
    why: "Proving ground for the ADR-0005 updater; also the point where ADR-0004 and ADR-0005 disagree",
  },
  {
    key: "RCON-1126",
    summary:
      "[PwC] Allow Super Admin, Admin, and Employee with Edit rights to create, edit, and delete entities",
    status: "In Implementation",
    owner: "Benjamin Garaude",
    why: "Client-driven permission change on the entity model",
  },
  {
    key: "RCON-1231",
    summary: "Enhancement - Delete Entity (BE)",
    status: "In Implementation",
    owner: "Benjamin Garaude",
    why: "Pairs with RCON-1233, which stops a referenced countryRegime being deleted",
  },
  {
    key: "RCON-1221",
    summary: "Regression Test Suite",
    status: "In Implementation",
    owner: "Rafał Bator",
    why: "High. The monolith merge and the database consolidation both need a regression net that does not exist yet",
  },
  {
    key: "RCON-1248",
    summary: "Test Automation pipeline creation",
    status: "In Implementation",
    owner: "Kamil Burek",
    why: "Companion to RCON-1221 — a suite nobody runs on every build is not a safety net",
  },
  {
    key: "RCON-1335",
    summary: "Design - UX Enhancement",
    status: "In PO Review",
    owner: "Kamil Burek",
    why: "The UI/UX half of the sprint goal",
  },
  {
    key: "RCON-1306",
    summary: "Improve validation errors display for records with multiple errors",
    status: "In PO Review",
    owner: "Rafał Bator",
    spillover: true,
    why: "The only item carried from sprint 13, and it has sat in Product Owner review across both",
  },
  {
    key: "RCON-1313",
    summary: "Validate UI auto refresh on rconnect platform",
    status: "New",
    owner: "Rafał Bator",
    why: "Still New two days before the sprint ends",
  },
  {
    key: "RCON-1390",
    summary: "Upgrading one-ui version to 6.0.1",
    status: "New",
    owner: "Unassigned",
    why: "Unassigned New work inside the committed sprint",
  },
  {
    key: "RCON-1355",
    summary: "[BUG] Resubmit report is not working correctly",
    status: "New",
    owner: "Unassigned",
    why: "Unassigned bug on the retry path; shares a messageRefId problem with the manual-upload work",
  },
];

/** Closed in RCON.S sprint 13 — the eight that actually reached Closed. */
export const previousSprintClosed: Ticket[] = [
  {
    key: "RCON-1206",
    summary: "Handling errors from database",
    status: "Closed",
    owner: "CE-Konstantin Artsiomenka",
  },
  {
    key: "RCON-1200",
    summary: "Catch and serve correctly an error when user fetches feedback manually",
    status: "Closed",
    owner: "Kamil Burek",
  },
  {
    key: "RCON-1189",
    summary: "Sorting and filtering don't work together",
    status: "Closed",
    owner: "Kamil Burek",
  },
  {
    key: "RCON-1176",
    summary: "[Bug] Inaccurate timezone shown",
    status: "Closed",
    owner: "Kamil Burek",
  },
  {
    key: "RCON-1175",
    summary: "[Bug] Multiplied toasts",
    status: "Closed",
    owner: "Kamil Burek",
  },
  {
    key: "RCON-1174",
    summary: "[Bug] Sorting by CorrMessageRefId and Timestamp doesn't work",
    status: "Closed",
    owner: "Kamil Burek",
  },
  {
    key: "RCON-1158",
    summary: "[BUG] Timestamp consistency across reports and Dashboard UI",
    status: "Closed",
    owner: "Kamil Burek",
  },
  {
    key: "RCON-1109",
    summary: "Add validations for BE for each field",
    status: "Closed",
    owner: "Unassigned",
  },
];

/**
 * Sprint 13 items sitting at Ready for integration. Jira treats these as
 * resolved, which is why the delivered count runs far ahead of Closed.
 */
export const readyForIntegration: Ticket[] = [
  {
    key: "RCON-1069",
    summary: "Following dynamic credentials, legacy credentials tables have to be removed",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "The ADR-0002 clean-up: cesop_credentials_de / _hu / _mt drop only when this lands",
  },
  {
    key: "RCON-1233",
    summary: "Prevent deletion of referenced countryRegime",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1240",
    summary: "Set jpa: open-in-view: false in rconnect-backend",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1259",
    summary: "Update the Jenkins pipeline to allow developers to create development environments",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1260",
    summary: "CVE - security vulnerability",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1273",
    summary: "Fix critical security issues reported by Sonar in rconnect-backend service",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1280",
    summary: "Submission Dev env testing",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1281",
    summary: "Micro service to copy NiFi flows from centralised bucket to local bucket",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "The Bucket Updater from ADR-0005",
  },
  {
    key: "RCON-1298",
    summary: "CESOP - Rconnect - M2M - Finland 13",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1302",
    summary: "Maintenance: Fix Sonar issues for rconnect-configuration",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1305",
    summary: "Bug when generated encryption secrets contain ${} chars",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1311",
    summary: "Maintenance: Create and configure Jenkins jobs for Dependency Track tool",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1338",
    summary: "Support Ticket - RRH (Abacus 360), FiTax",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RCON-1339",
    summary: "Support Ticket - RTH",
    status: "Ready for integration",
    owner: "Unassigned",
  },
];

/** Portfolio epics under RCON-872 Rconnect CORE, plus the release containers. */
export const coreEpics = [
  {
    key: "RCON-926",
    title: "[Refactoring Phase I] Transition to Monolithic Architecture",
    status: "In Implementation",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-931",
    title: "Merge RCON.S Services into a Monolith",
    status: "In Implementation",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-927",
    title: "[Refactoring Phase II] Codebase Generalization",
    status: "Ready for integration",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-1008",
    title: "Code Generalization",
    status: "Ready for integration",
    owner: "Kamil Burek",
  },
  {
    key: "RCON-928",
    title: "IAM Platform Integration",
    status: "New",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-1108",
    title: "Maintenance and Improvements",
    status: "In Implementation",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-898",
    title: "[RCON.S 2.0.0] Maintenance and Improvements",
    status: "Ready for integration",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-1210",
    title: "[RCON.S 2.1.0] Maintenance and Improvements",
    status: "Ready for integration",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-1377",
    title: "[2.2.0] Maintenance & Improvements",
    status: "New",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-1130",
    title: "Rcloud Readiness",
    status: "New",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-1112",
    title: "Application Security",
    status: "In Implementation",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-1406",
    title: "Application Security ('26)",
    status: "New",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-1405",
    title: "[PwC] User Feedback '26",
    status: "New",
    owner: "Anca Dobrea",
  },
  {
    key: "RCON-1408",
    title: "CESOP - Enhancements Phase 3 OPEN",
    status: "New",
    owner: "Anca Dobrea",
  },
];

/** Who consumes the submission flow. State is the Jira status of the tracking key. */
export const consumers = [
  {
    name: "FiTax (CESOP)",
    key: "RCON-272",
    state: "In Implementation",
    note: "Reference integrator. Drops files in the shared bucket; rcloud-fitax is the wrapper chart every other integration copies",
  },
  {
    name: "RTH — Regnology Tax Hub",
    key: "RCON-1336",
    state: "In Implementation",
    note: "First integrator to take Rconnect as an independent component instead of a subchart",
  },
  {
    name: "RRH / Abacus 360",
    key: "RCON-1338",
    state: "Ready for integration",
    note: "Live enough to raise support tickets; support is unassigned",
  },
  {
    name: "PL tON (BPS, SGB)",
    key: "RCON-930",
    state: "Closed",
    note: "Middle-supervisor route through tON",
  },
  {
    name: "IRS (IRIS) / 1099-DA",
    key: "RCON-764",
    state: "Closed",
    note: "US regime via ActiveMQ; RCON-735 closed the enabler",
  },
  {
    name: "PwC",
    key: "RCON-1405",
    state: "New",
    note: "Client feedback drives the entity permission and TEST/PROD work in the current sprint",
  },
  {
    name: "Softserve S9",
    key: "RCON-1181",
    state: "Ready for integration",
    note: "Onboarded through the enablers track",
  },
];

/** The work-package spine above the epics. */
export const layers = [
  { layer: "Product", key: "RCON-269", state: "In Progress" },
  { layer: "Submission flow", key: "RCON-270", state: "In Progress" },
  {
    layer: "Enablers — FiTax, RTH, RRH, tON",
    key: "RCON-271",
    state: "In Progress · MVP and country expansion Closed · integrators open",
  },
  {
    layer: "Rconnect CORE (2026)",
    key: "RCON-872",
    state: "In Progress · 7 portfolio epics",
  },
  {
    layer: "Out of scope here — Communicator",
    key: "RCON-276",
    state: "Separate product line, separate dashboard",
  },
];

export const architecture: {
  intro: string;
  components: ArchitectureComponent[];
  flow: FlowStep[];
  decisions: DecisionRecord[];
} = {
  intro:
    "Rconnect Submission is an orchestrator, not a report generator. A producing application drops a file in an agreed bucket location, Apache NiFi executes the country-specific delivery and feedback flows, and Rconnect tracks state so a supervisor can see where a report is. Integration is deliberately file-based: an integrator changes no business logic, only where it writes files. Java and Spring Boot on the backend, Angular on the front end, PostgreSQL for state, and Helm for every deployment.",
  components: [
    {
      component: "rconnect-backend",
      responsibility:
        "Submission and case state, entity and credential configuration, users and permissions, and the REST API the UI consumes. Merges the former monitor and user-management services.",
      technology: "Java 21 · Spring Boot · PostgreSQL",
      owner: "Submission squad",
    },
    {
      component: "rconnect-ui",
      responsibility:
        "Dashboard, case details, submissions and feedback tables, entity and regime configuration, manual report upload.",
      technology: "Angular · one-ui",
      owner: "Submission squad",
    },
    {
      component: "rconnect-nifi-adaptor",
      responsibility:
        "The only API boundary NiFi is allowed to call — credentials per entity, regime and country. Not intended for other teams.",
      technology: "Spring Boot REST",
      owner: "Submission squad",
    },
    {
      component: "Apache NiFi",
      responsibility:
        "Executes two flows per country regime: data delivery to the authority, and feedback or log retrieval. Holds no product state of its own.",
      technology: "NiFi 2.10 (no-hazelcast build) · custom processors from rconnect-utilities",
      owner: "NiFi contractors",
    },
    {
      component: "NiFi Registry + rconnect-updater",
      responsibility:
        "Versioned flow storage and reconciliation of the flow catalogue into a running canvas. The target shape here is contested — see ADR-0004 against ADR-0005.",
      technology: "NiFi Registry 2.10 · Java CLI · gcsfuse · PostgreSQL",
      owner: "NiFi contractors · DevOps",
    },
    {
      component: "auth-gateway",
      responsibility:
        "Single entry point. Terminates the browser session and delegates the OIDC flow before anything reaches the backend.",
      technology: "Traefik · oauth2-proxy · Okta",
      owner: "DevOps",
    },
    {
      component: "Shared object storage",
      responsibility:
        "The integration channel. Outbox for files to submit, Processed for delivered files, Feedback Request for retrieval triggers.",
      technology: "Google Cloud Storage bucket",
      owner: "Platform / rcloud",
    },
    {
      component: "Platform edge",
      responsibility:
        "Exposes the Rconnect host on the parent application's domain with the rc- prefix.",
      technology: "Istio VirtualService on GKE",
      owner: "Platform / rcloud",
    },
  ],
  flow: [
    {
      step: 1,
      title: "Producer drops a file in the Outbox",
      detail:
        "FiTax or another integrator writes the report into the agreed bucket folder. The exchange file name carries the routing facts: transmitter, country, regime, TEST or PROD, database id, reporting year, delivery reference, and the payload file name.",
    },
    {
      step: 2,
      title: "NiFi picks the file up on a timer",
      detail:
        "ListGCSBucket inside the Fetch From GCP To Tmp Dir process group runs once a minute. Its entity-tracking time window — three hours for Germany — bounds how long the whole delivery may take and has to stay wider than the retry window.",
    },
    {
      step: 3,
      title: "Flow resolves credentials for the entity",
      detail:
        "The Get Credentials for Entity group calls the NiFi adaptor for that entity, regime and country. Credentials are held encrypted, not in the flow.",
    },
    {
      step: 4,
      title: "Payload is prepared for the authority",
      detail:
        "The country flow signs or validates as that regime requires and preserves the payload file name required by the receiving authority, rather than the exchange file name used for routing.",
    },
    {
      step: 5,
      title: "Submission is delivered and recorded",
      detail:
        "The flow posts to the tax authority endpoint and records state back through the submission API. On success the file moves to Processed; on failure it moves to the errors location and the case is marked failed.",
    },
    {
      step: 6,
      title: "Feedback is retrieved separately",
      detail:
        "A trigger file in Feedback Request drives the retrieval flow, which polls the authority until a final answer arrives. Hungary can take up to 24 hours, so retrieval retries up to ten attempts rather than failing fast.",
    },
    {
      step: 7,
      title: "Authority answer is stored against its schema",
      detail:
        "Each country regime declares the shape of its feedback. The flow maps the authority response into that shape and the backend validates it on write, so Germany's DIP envelope and Finland's validation lists can coexist without a schema change per country.",
    },
    {
      step: 8,
      title: "Temporary material is destroyed",
      detail:
        "Every branch ends in the cleanup group: uploaded files, generated payloads, and certificates are deleted whether the branch succeeded or failed.",
    },
  ],
  decisions: [
    {
      title: "ADR-0001 — Collapse the services (Proposed, 11 Feb 2026)",
      detail:
        "Fold rconnect-bff, rconnect-user-management and the UI-facing part of rconnect-monitor into one rconnect-submission backend, and give NiFi its own boundary in rconnect-nifi-adaptor. The driver is cost of ownership, not scale: six-plus containers and roughly 12 GB of RAM to run locally for a product with fewer than a thousand users, across three different Spring Boot versions. A full monolith was rejected to keep the NiFi and UI domains apart. Success is measured — five containers, 8 GB, a five-minute local start, and no ArchUnit violations.",
      reference: { label: "ADRs", href: CONFLUENCE.adrs },
    },
    {
      title: "ADR-0002 — Consolidate the database (Proposed, 13 Mar 2026)",
      detail:
        "Replace the per-country credential tables with one credential table holding a JSONB payload, make reporting_regime_metadata the source of regime descriptors, and simplify user_permissions onto business keys — country code, entity name, regime — instead of numeric ids. Validation moves into the application layer as the price. Migration is parallel tables with dual read and write before cutover.",
      reference: { label: "ADRs", href: CONFLUENCE.adrs },
    },
    {
      title: "ADR-0003 — Keycloak-centred authentication (Proposed, 18 Mar 2026)",
      detail:
        "Today Traefik forwards authentication to oauth2-proxy, which runs the OIDC flow against Okta, while NiFi sits behind a separate allowlist validator. The decision centralises authorization through IAM and removes the public /nifi and /nifi-registry routes, leaving them internal to the cluster. It does not yet choose between Keycloak federating to Okta and Keycloak owning authentication outright — that choice is still open.",
      reference: { label: "ADRs", href: CONFLUENCE.adrs },
    },
    {
      title: "ADR-0004 — Git as the source of truth for flows (Proposed, 7 Apr 2026)",
      detail:
        "Make an rconnect-nifi-flows repository authoritative, one directory per flow holding flow.json and a meta.json that declares required parameters and a health endpoint. NiFi becomes runtime-only and NiFi Registry is removed along with its database. Branch per environment: feature branches for developers, develop for the release candidate, main for production. The cost is honest — updating a flow deletes and re-imports the process group, so in-flight files in queues can be lost unless the queue is drained first.",
      reference: { label: "ADRs", href: CONFLUENCE.adrs },
    },
    {
      title: "ADR-0005 — Registry updater service (Work in progress, May 2026)",
      detail:
        "Ship rconnect-nifi-updater, a one-shot Java CLI running as a sidecar inside the NiFi Registry pod, reconciling three things in lock-step: the flow snapshot tree mounted from a bucket, the Registry database, and the live canvas. A central bucket is the source of truth, confirmed with the rcloud team; pulling from Git at runtime was rejected outright because tenant workloads may not reach an external repository. Exit codes distinguish success, partial success and fatal failure, and a saga per flow stops one bad flow aborting the run. This ADR keeps the Registry that ADR-0004 deletes.",
      reference: { label: "ADRs", href: CONFLUENCE.adrs },
    },
    {
      title: "ADR-0006 — Rconnect as a standalone app (Proposed, 10 Jun 2026)",
      detail:
        "Stop shipping Rconnect as a subchart of the parent application. Today FiTax owns the bucket and the release window, so Rconnect cannot be versioned or rolled back on its own. The bucket becomes an externally provisioned shared resource that neither application owns, with per-application identity through Workload Identity and no shared keys. Negative consequences are recorded as still to be determined.",
      reference: { label: "ADRs", href: CONFLUENCE.adrs },
    },
    {
      title: "ADR-0006 (second) — Schema-driven feedback storage (Work in progress, Aug 2026)",
      detail:
        "Give every country regime a declared feedback schema and store the authority answer as validated JSON in one content column. The fixed CESOP-shaped feedback table cannot hold Germany's DIP envelope, Finland's form and error data, Hungary's fault envelope, or the unrelated structures from Latvia and Poland. Undeclared fields are rejected, so the schema must be updated before a flow starts sending a new field. Replacing the fixed response is a breaking API change, delivered under a new API version. Note the number collides with the standalone-app ADR above.",
      reference: { label: "ADRs", href: CONFLUENCE.adrs },
    },
  ],
};

export const implementation: {
  intro: string;
  notes: ImplementationNote[];
  config: ConfigRow[];
} = {
  intro:
    "What is actually being built behind those decisions, ticket by ticket. Statuses are the Jira states in the 19 Aug 2026 snapshot. Note that this project sets a resolution date at Ready for integration, so a great deal of work reads as delivered while still sitting in front of a release.",
  notes: [
    {
      area: "Collapse into one backend",
      detail:
        "The ADR-0001 topology change. Refactoring Phase I carries the monolith transition and RCON-931 the actual service merge; both are in implementation while the regression suite that would protect them is not finished.",
      tickets: ["RCON-926", "RCON-931", "RCON-1343"],
      state: "In Implementation",
    },
    {
      area: "Generalize the codebase",
      detail:
        "Phase II of the refactor: take the country-specific assumptions out of the code so a new regime is configuration rather than a release. Sits at Ready for integration.",
      tickets: ["RCON-927", "RCON-1008"],
      state: "Ready for integration",
    },
    {
      area: "Dynamic credentials and database consolidation",
      detail:
        "The ADR-0002 model. Dynamic credentials landed; the legacy per-country credential tables only disappear when RCON-1069 is released, so both models exist in production today.",
      tickets: ["RCON-1069", "RCON-1233"],
      state: "Ready for integration",
    },
    {
      area: "TEST versus PROD routing",
      detail:
        "Critical, and split across the backend and the flow. The TestProd segment of the FiTax exchange file name decides the environment; a missing or invalid value must fail the submission and hand an error back to FiTax rather than guess. The credentials endpoint grows an environment parameter to match.",
      tickets: ["RCON-1366", "RCON-1381"],
      state: "In Implementation",
    },
    {
      area: "Error reasons out of NiFi",
      detail:
        "Backend and NiFi halves of the same requirement: carry why a submission failed, not just that it failed. The backend half is in implementation, the NiFi half is still New.",
      tickets: ["RCON-902", "RCON-1382"],
      state: "In Implementation · NiFi half New",
    },
    {
      area: "Schema-driven feedback",
      detail:
        "Feedback moves to a declared schema per country regime with a single validated JSON column, replacing the CESOP-shaped columns. Delivered as a new API version with the old contract kept while consumers migrate.",
      tickets: ["RCON-1306", "RCON-1200"],
      state: "Design accepted · rollout pending",
    },
    {
      area: "Flow distribution",
      detail:
        "The bucket-to-bucket copier and the Registry updater instance. This is where the contradiction between ADR-0004 and ADR-0005 has to be settled, because one deletes the Registry and the other builds inside it.",
      tickets: ["RCON-1281", "RCON-1173"],
      state: "In Implementation",
    },
    {
      area: "Manual upload hardening",
      detail:
        "Manual upload is an escape hatch into the same NiFi Outbox, not a second pipeline. It checks the file name against the case but never the entity, so a correctly named file for another entity in the same country is submitted as that entity. RCON-1409 makes that a hard reject, keeps the dialog open on failure, and stops the success message claiming the report reached the authority.",
      tickets: ["RCON-1409", "RCON-1355", "RCON-564"],
      state: "New · refinement pack attached",
    },
    {
      area: "Entity and permission model",
      detail:
        "Client-driven changes from PwC: who may create, edit and delete entities, and preventing deletion of a regime that is still referenced.",
      tickets: ["RCON-1126", "RCON-1231"],
      state: "In Implementation",
    },
    {
      area: "Test safety net",
      detail:
        "A regression suite and the pipeline to run it. Both are High and both are prerequisites for trusting the monolith merge, yet they are being built in the same sprint as the merge.",
      tickets: ["RCON-1221", "RCON-1248"],
      state: "In Implementation",
    },
    {
      area: "Platform integration with IAM",
      detail:
        "Reuse the shared Identity and Access Management platform instead of the local Okta-plus-user-management pairing, per ADR-0003. Still New, and the Keycloak topology question inside that ADR is still undecided.",
      tickets: ["RCON-928"],
      state: "New",
    },
    {
      area: "Application security",
      detail:
        "Jenkins runs static analysis and composition analysis for the whole flow. Sonar clean-up and CVE work is largely at Ready for integration; three Critical findings in shipped images remain real.",
      tickets: ["RCON-1112", "RCON-1273", "RCON-1302", "RCON-1260"],
      state: "In Implementation",
    },
  ],
  config: [
    {
      setting: "rconnect.enabled",
      value: "false by default",
      meaning:
        "The subchart is inert until an instance turns it on. Nothing is exposed while it is false.",
    },
    {
      setting: "global.rconnectAppDomainPrefix",
      value: '"rc-"',
      meaning:
        "Rconnect's host is the parent application's host with this prefix, which is how the Okta redirect URIs are derived.",
    },
    {
      setting: "global.oidc.issuerURL / discoverURL",
      value: "https://portal.regnology.net/oauth2/default",
      meaning:
        "The Okta issuer the gateway trusts. A production instance needs its own Okta application, raised through Service Desk.",
    },
    {
      setting: "rconnect.authGateway.oauth2-proxy.configuration.clientID / clientSecret",
      value: "per instance",
      meaning:
        "Browser sessions are terminated at the gateway with these. Backend APIs then require an Okta bearer token in their own right.",
    },
    {
      setting: "NiFiEnvVariables",
      value: "inherited by every {Country}Parameters context",
      meaning:
        "Mandatory inheritance. A country parameter context that does not inherit it is missing its environment.",
    },
    {
      setting: "Entity Tracking Time Window (ListGCSBucket)",
      value: "3 hours for Germany",
      meaning:
        "Caps the total time a delivery may take. If the retry window ever exceeds it, a file can be dropped silently.",
      warning: true,
    },
    {
      setting: "Penalty Duration",
      value: "hard-coded on the processor",
      meaning:
        "Retry spacing is set on the Settings tab rather than parameterised, so it cannot be tuned per environment.",
      warning: true,
    },
    {
      setting: "Retry strategy",
      value: "2 retries on delivery · up to 10 attempts on feedback",
      meaning:
        "No distinction between recoverable and non-recoverable errors — everything is retried, including failures that will never succeed.",
      warning: true,
    },
    {
      setting: "Parameter Context on a copied process group",
      value: "inherited from the source",
      meaning:
        "Copy-paste is the documented reuse mechanism, and it silently keeps the wrong context. Must be checked on every copied group, not just the top level.",
      warning: true,
    },
    {
      setting: "jpa.open-in-view",
      value: "false",
      meaning:
        "Set deliberately in rconnect-backend to stop lazy loading escaping into the view layer.",
    },
  ],
};

export const deployment: {
  intro: string;
  targets: DeploymentTarget[];
  pipeline: string[];
} = {
  intro:
    "Rconnect ships as Helm charts into GKE, today as a subchart of the consuming application's Rcloud wrapper chart. That is precisely what ADR-0006 sets out to change: while Rconnect is a subchart it shares the parent's release window, its rollback, and its bucket. RTH (RCON-1336) is the first integration being taken through the standalone route.",
  targets: [
    {
      environment: "Dev cluster",
      topology: "namespace rconnect-rcon-dev · full stack including NiFi and Registry",
      state: "Live",
      note: "The shared proving ground, and explicitly marked do-not-modify for demos. NiFi is reachable at /nifi/ here — a route ADR-0003 intends to close.",
    },
    {
      environment: "Marley staging",
      topology: "Rcloud instance per tenant and space",
      state: "Live",
      note: "Where an instance is created with rconnect.enabled and the OIDC block before anything reaches production.",
    },
    {
      environment: "Production as a component",
      topology: "subchart of the parent wrapper chart · host prefixed rc-",
      state: "Live for FiTax",
      note: "Needs its own Okta application through Service Desk. The backend API is customer specific and not published for general use.",
    },
    {
      environment: "Production as a standalone app",
      topology: "independent release · externally provisioned shared bucket",
      state: "Proposed (ADR-0006)",
      note: "The target model. Bucket provisioned by infrastructure, access through Workload Identity per application, no shared keys.",
    },
    {
      environment: "On premise",
      topology: "no cloud object storage",
      state: "Documented variant only",
      note: "Sketched in ADR-0005 for environments without a bucket. Not built.",
    },
  ],
  pipeline: [
    "Derive the Rconnect host from the parent application's Rcloud link by prefixing it with rc-.",
    "Raise a Service Desk ticket to register the Rconnect application in production Okta — OIDC web app, PKCE required, redirect to <host>/oauth2/callback, refresh-token rotation every 30 seconds.",
    "Collect the client id and secret, and assign the default rconnect-admin account to the Okta application.",
    "Add the rconnect subchart dependency to the wrapper chart in rcloud-apps, gated on condition rconnect.enabled.",
    "Add the global image, domain, prefix and Istio gateway values, leaving rconnect.enabled false.",
    "Add the VirtualService template so the endpoint only exists when the chart is enabled.",
    "Update the Jenkins chart-generation script for the new chart, image, bucket and storage parameters.",
    "Create the instance with rconnect.enabled true, the OIDC block, and the gateway client credentials.",
    "Log in as the admin account and grant at least one real user Super User rights — that user must also be in the Okta group assigned to the application.",
    "Configure the regime with its schema, then the entity with its per-regime credentials, then the submission case for the reporting period.",
  ],
};

export const roadmap: RoadmapPhase[] = [
  {
    phase: "Phase 1 — MVP",
    window: "2024 – 2025",
    state: "Closed",
    goal:
      "Prove the model: a producer drops a file, NiFi delivers it to an authority, and Rconnect shows what happened.",
    items: [
      { key: "RCON-274", title: "Phase 1 (MVP)", status: "Closed", note: "Enabler work package" },
      {
        key: "RCON-288",
        title: "Auth service for Rconnect",
        status: "Closed",
        note: "Okta and the gateway",
      },
      { key: "RCON-289", title: "Dashboard", status: "Closed", note: "" },
      { key: "RCON-291", title: "Case Details", status: "Closed", note: "" },
      { key: "RCON-292", title: "Report Submission", status: "Closed", note: "" },
      {
        key: "RCON-302",
        title: "Integration with FITAX",
        status: "Closed",
        note: "First integrator",
      },
      {
        key: "RCON-335",
        title: "Deployment of Rconnect to Rcloud",
        status: "Closed",
        note: "Subchart model",
      },
    ],
    exit: [
      "FiTax submits through Rconnect in production.",
      "A supervisor can see the state of a submission without asking an engineer.",
    ],
  },
  {
    phase: "Phase 2 — Country expansion",
    window: "2025 – early 2026",
    state: "Closed",
    goal:
      "Add regimes and authorities without rewriting the pipeline, and give users manual control where automation cannot reach.",
    items: [
      {
        key: "RCON-273",
        title: "Phase 2 (Country Expansion)",
        status: "Closed",
        note: "Enabler work package",
      },
      {
        key: "RCON-400",
        title: "HU integration with tax authority portal",
        status: "Closed",
        note: "Feedback can take 24 hours",
      },
      { key: "RCON-401", title: "MT integration", status: "Closed", note: "" },
      { key: "RCON-402", title: "LV integration", status: "Closed", note: "" },
      { key: "RCON-403", title: "CY integration", status: "Closed", note: "" },
      { key: "RCON-861", title: "Cyprus submission and feedback", status: "Closed", note: "" },
      { key: "RCON-874", title: "[DE] Enhancements Germany", status: "Closed", note: "DIP envelope" },
      {
        key: "RCON-397",
        title: "Manual report upload / manual retry",
        status: "Closed",
        note: "Hardening now open as RCON-1409",
      },
      {
        key: "RCON-399",
        title: "Integrate with IRS (IRIS)",
        status: "Closed",
        note: "1099-DA followed as RCON-764",
      },
    ],
    exit: [
      "Every contracted country regime has a delivery and a feedback flow.",
      "Users can retry a failed submission without engineering help.",
    ],
  },
  {
    phase: "Phase 2.5 — Working state (2.0 / 2.1)",
    window: "Mar – Aug 2026",
    state: "Ready for integration",
    goal:
      "Make what shipped actually dependable: bug fixes, Sonar and CVE clean-up, dynamic credentials, and consistent timestamps and sorting.",
    items: [
      {
        key: "RCON-898",
        title: "[RCON.S 2.0.0] Maintenance and Improvements",
        status: "Ready for integration",
        note: "Cloned forward into 2.1.0",
      },
      {
        key: "RCON-1210",
        title: "[RCON.S 2.1.0] Maintenance and Improvements",
        status: "Ready for integration",
        note: "Container for technical and must-do AppSec work",
      },
      {
        key: "RCON-1069",
        title: "Remove legacy credentials tables",
        status: "Ready for integration",
        note: "Completes the ADR-0002 credential model",
      },
      {
        key: "RCON-1273",
        title: "Critical Sonar issues in rconnect-backend",
        status: "Ready for integration",
        note: "",
      },
      {
        key: "RCON-1311",
        title: "Dependency Track Jenkins jobs",
        status: "Ready for integration",
        note: "Supply-chain visibility",
      },
    ],
    exit: [
      "Ready for integration work is actually released, not just resolved.",
      "No open Critical vulnerability in a shipped image.",
      "One credential model in production, not two.",
    ],
  },
  {
    phase: "Phase 3 — CORE refactor and platform fit",
    window: "2026",
    state: "In Implementation",
    goal:
      "Reduce the cost of owning the product: fewer services, one database model, generalized code, and the shared platform's identity instead of a local one.",
    items: [
      {
        key: "RCON-926",
        title: "[Refactoring Phase I] Transition to Monolithic Architecture",
        status: "In Implementation",
        note: "ADR-0001",
      },
      {
        key: "RCON-931",
        title: "Merge RCON.S services into a monolith",
        status: "In Implementation",
        note: "The actual merge",
      },
      {
        key: "RCON-927",
        title: "[Refactoring Phase II] Codebase Generalization",
        status: "Ready for integration",
        note: "A new regime should be configuration",
      },
      {
        key: "RCON-1221",
        title: "Regression Test Suite",
        status: "In Implementation",
        note: "Prerequisite for trusting the merge",
      },
      {
        key: "RCON-928",
        title: "IAM Platform Integration",
        status: "New",
        note: "ADR-0003, Keycloak topology still open",
      },
      {
        key: "RCON-1130",
        title: "Rcloud Readiness",
        status: "New",
        note: "Standalone deployment per ADR-0006",
      },
      {
        key: "RCON-1336",
        title: "RTH integration as an independent component",
        status: "In Implementation",
        note: "First standalone integrator",
      },
    ],
    exit: [
      "Local development runs in five containers and 8 GB, and starts in five minutes.",
      "The regression suite runs on every build before the merge is declared done.",
      "Rconnect can be released and rolled back without the parent application.",
      "One decision on the record for flow distribution — ADR-0004 or ADR-0005, not both.",
    ],
  },
  {
    phase: "Phase 4 — Client-driven and later",
    window: "Late 2026 onward",
    state: "New",
    goal:
      "Client feedback and the next maintenance train, sequenced after the refactor rather than alongside it.",
    items: [
      {
        key: "RCON-1377",
        title: "[2.2.0] Maintenance & Improvements",
        status: "New",
        note: "Next train",
      },
      {
        key: "RCON-1405",
        title: "[PwC] User Feedback '26",
        status: "New",
        note: "Drives entity permissions and TEST/PROD work",
      },
      {
        key: "RCON-1409",
        title: "Manual upload must reject another entity's file",
        status: "New",
        note: "Cross-entity submission risk",
      },
      {
        key: "RCON-1408",
        title: "CESOP Enhancements Phase 3",
        status: "New",
        note: "",
      },
      {
        key: "RCON-1406",
        title: "Application Security '26",
        status: "New",
        note: "",
      },
    ],
    exit: [
      "Nothing here should start while the Phase 3 exit criteria are unmet.",
      "Manual upload cannot submit for an entity the user has no rights to.",
    ],
  },
];

export const backlogGantt: GanttItem[] = [
  { id: "mvp", label: "Phase 1 MVP", ticket: "RCON-274", start: "2024-09-01", end: "2025-06-30", status: "done", lane: "Delivered" },
  { id: "expand", label: "Country expansion", ticket: "RCON-273", start: "2025-04-01", end: "2026-02-28", status: "done", lane: "Delivered" },
  { id: "irs", label: "IRS / 1099-DA", ticket: "RCON-764", start: "2025-09-01", end: "2026-05-31", status: "done", lane: "Delivered" },
  { id: "v20", label: "RCON.S 2.0.0 maintenance", ticket: "RCON-898", start: "2026-03-01", end: "2026-06-30", status: "done", lane: "Working state" },
  { id: "v21", label: "RCON.S 2.1.0 maintenance", ticket: "RCON-1210", start: "2026-06-16", end: "2026-09-30", status: "active", lane: "Working state" },
  { id: "cred", label: "Drop legacy credential tables", ticket: "RCON-1069", start: "2026-05-01", end: "2026-09-30", status: "active", lane: "Working state" },
  { id: "mono", label: "Monolith transition", ticket: "RCON-926", start: "2026-02-11", end: "2026-11-30", status: "active", lane: "CORE refactor" },
  { id: "merge", label: "Merge services", ticket: "RCON-931", start: "2026-04-01", end: "2026-10-31", status: "active", lane: "CORE refactor" },
  { id: "general", label: "Codebase generalization", ticket: "RCON-927", start: "2026-05-01", end: "2026-12-15", status: "active", lane: "CORE refactor" },
  { id: "regress", label: "Regression suite + pipeline", ticket: "RCON-1221", start: "2026-07-01", end: "2026-10-15", status: "active", lane: "CORE refactor" },
  { id: "testprod", label: "TEST / PROD routing", ticket: "RCON-1366", start: "2026-08-05", end: "2026-08-29", status: "active", lane: "This sprint" },
  { id: "errreason", label: "NiFi error reasons", ticket: "RCON-902", start: "2026-07-15", end: "2026-09-15", status: "active", lane: "This sprint" },
  { id: "flows", label: "Flow distribution (updater)", ticket: "RCON-1173", start: "2026-05-01", end: "2026-10-31", status: "blocked", lane: "CORE refactor" },
  { id: "iam", label: "IAM platform integration", ticket: "RCON-928", start: "2026-10-01", end: "2027-03-31", status: "planned", lane: "Platform" },
  { id: "rcloud", label: "Rcloud readiness / standalone", ticket: "RCON-1130", start: "2026-09-01", end: "2027-02-28", status: "planned", lane: "Platform" },
  { id: "manual", label: "Manual upload hardening", ticket: "RCON-1409", start: "2026-09-01", end: "2026-11-30", status: "planned", lane: "Client-driven" },
  { id: "v22", label: "2.2.0 maintenance", ticket: "RCON-1377", start: "2026-10-01", end: "2027-01-31", status: "planned", lane: "Client-driven" },
  { id: "cesop3", label: "CESOP enhancements Phase 3", ticket: "RCON-1408", start: "2026-11-01", end: "2027-04-30", status: "later", lane: "Client-driven" },
  { id: "onprem", label: "On-premise variant", ticket: "RCON-1130", start: "2027-01-01", end: "2027-06-30", status: "later", lane: "Platform" },
];

export const stakeholderGantt: GanttItem[] = [
  { id: "fitax", label: "FiTax CESOP in production", ticket: "RCON-302", start: "2025-01-01", end: "2025-09-30", status: "done", lane: "In market" },
  { id: "ton", label: "PL tON (BPS, SGB)", ticket: "RCON-930", start: "2025-06-01", end: "2026-03-31", status: "done", lane: "In market" },
  { id: "iris", label: "IRS (IRIS) submission", ticket: "RCON-399", start: "2025-09-01", end: "2026-06-30", status: "done", lane: "In market" },
  { id: "rrh", label: "RRH / Abacus 360 support", ticket: "RCON-1338", start: "2026-06-01", end: "2026-12-31", status: "active", lane: "In market" },
  { id: "s9", label: "Softserve S9 onboarding", ticket: "RCON-1181", start: "2026-05-01", end: "2026-10-31", status: "active", lane: "Onboarding" },
  { id: "rth", label: "RTH as independent component", ticket: "RCON-1336", start: "2026-07-01", end: "2026-12-15", status: "active", lane: "Onboarding" },
  { id: "pwc", label: "PwC feedback — entities and TEST/PROD", ticket: "RCON-1405", start: "2026-08-01", end: "2027-01-31", status: "active", lane: "Client-driven" },
  { id: "fin", label: "CESOP M2M Finland", ticket: "RCON-1298", start: "2026-06-01", end: "2026-09-30", status: "active", lane: "In market" },
  { id: "standalone", label: "Standalone releases (bucket shared)", ticket: "RCON-1130", start: "2026-09-01", end: "2027-03-31", status: "planned", lane: "Platform" },
  { id: "iamshare", label: "Shared IAM instead of local Okta", ticket: "RCON-928", start: "2026-10-01", end: "2027-03-31", status: "planned", lane: "Platform" },
];

/**
 * Roles are inferred from Jira ownership and Confluence authorship: the team
 * table on the product page has most names blank.
 */
export const stakeholders = [
  {
    name: "Anca Dobrea",
    role: "Product owner / initiative owner",
    interest: "RCON-872 Rconnect CORE, the enablers work package, and every release container",
    raci: "A",
    org: "Rconnect (R&D)",
  },
  {
    name: "Kamil Burek",
    role: "Tech lead",
    interest: "Architecture decision records, generalization, test automation, UX enhancement",
    raci: "R / A (technical)",
    org: "Rconnect (R&D)",
  },
  {
    name: "Alexander Becht",
    role: "Product / portfolio",
    interest: "RCON-269 Rconnect and RCON-270 Submission Flow, customer implementations",
    raci: "A (portfolio)",
    org: "Rconnect (R&D)",
  },
  {
    name: "Benjamin Garaude",
    role: "Backend engineer",
    interest: "TEST/PROD routing, entity model, RTH integration",
    raci: "R",
    org: "Rconnect (R&D)",
  },
  {
    name: "CE-Alexandru Calinescu",
    role: "NiFi specialist",
    interest: "Country flows, the registry updater, the TEST/PROD flow half",
    raci: "R",
    org: "External contractor",
  },
  {
    name: "Andras Gungl",
    role: "NiFi developer",
    interest: "Country delivery and feedback flows",
    raci: "R",
    org: "External contractor",
  },
  {
    name: "Rafał Bator",
    role: "Quality assurance",
    interest: "Regression suite, validation error display, UI auto refresh",
    raci: "R (quality)",
    org: "Rconnect (R&D)",
  },
  {
    name: "Vinodh Soundararajan",
    role: "DevOps",
    interest: "Registry updater instance, environments, Jenkins pipelines",
    raci: "R (platform)",
    org: "Shared services (temporary)",
  },
  {
    name: "FiTax, RTH, RRH product teams",
    role: "Integrators",
    interest: "Bucket contract, file naming, credentials endpoint, release windows",
    raci: "C",
    org: "Consuming products",
  },
  {
    name: "Application Security",
    role: "Security governance",
    interest: "Jenkins CA and OSA scans, container CVEs, Sonar findings",
    raci: "C / A (security)",
    org: "Regnology AppSec",
  },
];

export const raciHeaders = [
  "Activity",
  "Dobrea (PO)",
  "Burek (Tech lead)",
  "Submission squad",
  "NiFi contractors",
  "Integrators",
  "AppSec",
];

export const raciRows = [
  ["Product scope and release trains", "A", "C", "I", "I", "C", "I"],
  ["Architecture decision records", "C", "A", "R", "C", "I", "C"],
  ["Monolith merge and database consolidation", "A", "R", "R", "I", "I", "I"],
  ["Country flow build and change", "C", "C", "I", "R", "C", "I"],
  ["Flow distribution model (ADR-0004 vs ADR-0005)", "A", "R", "C", "R", "I", "I"],
  ["TEST / PROD submission routing", "A", "C", "R", "R", "C", "I"],
  ["Regression suite and test pipeline", "A", "R", "R", "I", "I", "I"],
  ["Deployment and Okta registration", "I", "C", "R", "I", "C", "C"],
  ["Container CVEs and Sonar findings", "I", "R", "R", "I", "I", "A"],
  ["Integrator onboarding and support", "A", "C", "R", "C", "R", "I"],
];

export const rice = [
  {
    item: "TEST / PROD submission routing",
    ticket: "RCON-1366",
    reach: 9,
    impact: 3,
    confidence: 0.9,
    effort: 2,
    why: "A test file reaching a live tax authority is a regulatory incident, not a bug. Critical, in flight, and split across two tickets that must land together.",
    bottleneck: true,
  },
  {
    item: "Regression suite and test pipeline",
    ticket: "RCON-1221",
    reach: 8,
    impact: 3,
    confidence: 0.8,
    effort: 3,
    why: "Everything in the CORE refactor is riskier without it, and it is being built in parallel with the merge it should protect.",
    bottleneck: true,
  },
  {
    item: "Manual upload entity check",
    ticket: "RCON-1409",
    reach: 7,
    impact: 3,
    confidence: 0.9,
    effort: 2,
    why: "Today a correctly named file for another entity in the same country is submitted as that entity. Refinement analysis is already attached.",
    bottleneck: true,
  },
  {
    item: "Settle the flow distribution model",
    ticket: "RCON-1173",
    reach: 6,
    impact: 3,
    confidence: 0.6,
    effort: 3,
    why: "ADR-0004 deletes NiFi Registry; ADR-0005 builds a service inside it. Both are open, and RCON-1173 is being implemented against one of them.",
    bottleneck: true,
  },
  {
    item: "Release the Ready for integration backlog",
    ticket: "RCON-1210",
    reach: 8,
    impact: 2,
    confidence: 0.8,
    effort: 2,
    why: "Fourteen of sprint 13's twenty-three items are resolved but unreleased. Value is booked and not banked.",
    bottleneck: true,
  },
  {
    item: "Monolith merge",
    ticket: "RCON-931",
    reach: 5,
    impact: 3,
    confidence: 0.7,
    effort: 5,
    why: "Cuts the cost of running and developing the product, with measured targets in ADR-0001. Large, and safest after the regression suite.",
  },
  {
    item: "Drop the legacy credential tables",
    ticket: "RCON-1069",
    reach: 5,
    impact: 2,
    confidence: 0.9,
    effort: 1,
    why: "Two credential models in production is an avoidable failure mode; the replacement already works.",
  },
  {
    item: "Close the three Critical container CVEs",
    ticket: "RCON-1112",
    reach: 8,
    impact: 2,
    confidence: 0.7,
    effort: 2,
    why: "nginx in the UI image, libssh2 in the NiFi images, and Jetty in ZooKeeper are triaged as real. The PostgreSQL image cannot be patched by this team at all.",
  },
  {
    item: "Schema-driven feedback rollout",
    ticket: "RCON-1306",
    reach: 6,
    impact: 2,
    confidence: 0.7,
    effort: 3,
    why: "Removes a backend release from every new country feedback format. Breaking change, so it needs the versioned API and a migration window.",
  },
  {
    item: "IAM platform integration",
    ticket: "RCON-928",
    reach: 6,
    impact: 2,
    confidence: 0.5,
    effort: 5,
    why: "Retires a local identity stack, but the Keycloak topology inside ADR-0003 is undecided and the shared platform's own Principal User work is not finished.",
  },
];

export const bottlenecks = [
  {
    title: "Two live architecture decisions contradict each other",
    ticket: "RCON-1173",
    detail:
      "ADR-0004 makes Git the source of truth and removes NiFi Registry and its database outright. ADR-0005 builds a reconciliation service that lives inside the NiFi Registry pod and treats a central bucket as the source of truth. Both are open — one Proposed, one Work in progress — and RCON-1173 is already building an instance against the second.",
  },
  {
    title: "Resolved but not released",
    ticket: "RCON-1210",
    detail:
      "This project sets a resolution date at Ready for integration, so 806 items read as done against 67 open. Fourteen of sprint 13's twenty-three items sit there, all unassigned, including the legacy credential-table removal and the Sonar and CVE fixes.",
  },
  {
    title: "Sprint 14 has nothing Closed with two days left",
    ticket: "RCON-1306",
    detail:
      "Fifteen committed, none Closed: nine in implementation, two parked in Product Owner review, and four still New — including an unassigned bug and an unassigned dependency upgrade. The only carry-over from sprint 13, RCON-1306, has spent both sprints in review.",
  },
  {
    title: "Manual upload does not check the entity",
    ticket: "RCON-1409",
    detail:
      "The file name is validated against the case's country and period but never its entity, so a correctly named file for another entity in the same country is accepted and submitted as that entity. Writer rights are per entity, country and regime, and the upload endpoint does not enforce them.",
  },
  {
    title: "NiFi retries everything, recoverable or not",
    ticket: "NiFi integration guide",
    detail:
      "There is no distinction between recoverable and non-recoverable errors: delivery retries twice, feedback up to ten times, and the penalty duration is hard-coded on the processor. Retries must stay inside the three-hour entity-tracking window or a file is dropped without a trace.",
  },
  {
    title: "Three Critical CVEs in shipped images",
    ticket: "RCON-1112",
    detail:
      "Triaged as real, not false positives: nginx in rconnect-ui 2.1.0, libssh2 in the NiFi and NiFi Registry images, and jetty-http in ZooKeeper. Separately, the team states it cannot fix vulnerabilities in the PostgreSQL image it depends on.",
  },
  {
    title: "Copy-paste is the documented way to reuse a flow",
    ticket: "NiFi integration guide",
    detail:
      "Reuse means copying a process group, which silently inherits the source parameter context. The guide's own mitigation is to remember to check the context on every copied group. Certificate and temporary-file cleanup is likewise manual on every branch.",
  },
  {
    title: "Release versioning does not separate the two products",
    ticket: "RCON-276",
    detail:
      "RCON holds both Submission and Communicator. Jira's next version is RCON.C 1.2.0 on 26 Aug 2026 — a Communicator release — while Submission tracks RCON.S 2.0.0, 2.1.0 and 2.2.0 in epic titles. A project-level release date says nothing about this product.",
  },
];
