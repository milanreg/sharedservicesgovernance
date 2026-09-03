import type {
  ArchitectureComponent,
  DecisionRecord,
  DeploymentTarget,
  FlowStep,
  GanttItem,
  ImplementationNote,
  ConfigRow,
  RoadmapPhase,
  Ticket,
} from "../template/types";

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

export const SNAPSHOT = "3 Sep 2026";

export const sprint = {
  name: "RSH PL 2617",
  id: 21351,
  start: "27 Aug 2026",
  end: "10 Sep 2026",
  board: 2936,
  committed: 8,
  done: 0,
  inProgress: 5,
  ready: 2,
  new: 1,
  blocked: 1,
  spillover: 2,
};

export type { GanttItem, Ticket } from "../template/types";

export const sprintTickets: Ticket[] = [
  {
    key: "RSH-4215",
    summary: "[IAM] Add module permission manager as IAM role",
    status: "In Implementation",
    owner: "Celso Garcia",
    why: "New role so a module can manage its own permissions without a platform-wide grant",
  },
  {
    key: "RSH-4214",
    summary: "[IAM] Allow unscoped module permissions",
    status: "In PO Review",
    owner: "Dominik Czerwiński",
    why: "Unblocks module-level grants that do not carry an entity scope",
  },
  {
    key: "RSH-5675",
    summary: "[IAM CI] Cancel superseded pipelines and ensure terminal state",
    status: "In Quality Review",
    owner: "Shashank Prasad",
    why: "Stops stale pipelines from racing the live one and leaving the IAM build hanging",
  },
  {
    key: "RSH-2453",
    summary: "Configure all modules to use IAM and Platform in Dev Cluster",
    status: "In Quality Review",
    owner: "Pawel Skrzypczynski",
    why: "Integration proving ground for Vizor, Analytics, Rconnect",
    spillover: true,
  },
  {
    key: "RSH-5442",
    summary: '[DC] Entity groups - "All" Group',
    status: "In Implementation",
    owner: "Shashank Prasad",
    why: "Master Data Management work that entity-group inheritance (RSH-2169) is waiting on",
  },
  {
    key: "RSH-4784",
    summary: "POC: Personal Access Token implemented using Keycloak’s standard OIDC offline session mechanism",
    status: "Ready",
    owner: "Paweł Śnieżek",
    why: "Phase 3 PAT spike — started while the 2616 integration queue is still unclosed",
  },
  {
    key: "RSH-4211",
    summary: "User-bound Personal Access Tokens (API Keys) for non-interactive access as the signed-in user",
    status: "New",
    owner: "Paweł Śnieżek",
    why: "The production PAT story that sits behind the RSH-4784 spike",
  },
  {
    key: "RSH-2169",
    summary: "[IAM] [Blocked] Entity group inheritance for entity access",
    status: "Ready",
    owner: "Unassigned",
    why: "Vizor API Service (VAS) entityGroups contract cannot expand members — blocked on Master Data Management (MDM)",
    blocked: true,
    spillover: true,
  },
];

export const previousSprintClosed: Ticket[] = [
  {
    key: "RSH-4246",
    summary: "[IAM] Bug: User cannot assign Scoped permission from IAM Module to Scoped group",
    status: "Closed",
    owner: "Dominik Czerwiński",
  },
  {
    key: "RSH-3496",
    summary: "[IAM] Make view/manage roles entity-aware (vocabulary, model, parsing, FE)",
    status: "Closed",
    owner: "Celso Garcia",
  },
  {
    key: "RSH-4260",
    summary: "[IAM UI] Bug: Join Group dialog has no scroll when many groups are available",
    status: "Closed",
    owner: "Unassigned",
  },
];

/** 2616 items that did not make the 2617 commitment. */
export const leftoverFrom2616: Ticket[] = [
  {
    key: "RSH-4220",
    summary:
      "[IAM] Bug: Users with View + Manage Permissions can edit their own permissions and escalate to Manage Users/Groups/Clients",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "Privilege escalation — go-live blocker for delegated admin",
  },
  {
    key: "RSH-3042",
    summary: "[IAM] Spike: Migrate users and groups to entity scoping",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "Vizor API Service (VAS) effectivePermissions already assumes this model",
  },
  {
    key: "RSH-3503",
    summary: "[IAM] Spike: Migrate existing IAM permissions to new version",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "Companion to entity-scoping migration",
  },
  {
    key: "RSH-3481",
    summary: "[IAM] Remove direct group-id grant path entirely",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RSH-4244",
    summary:
      "[IAM] Bug: User can see Entity/Entity Groups for permission from assigned roles without Permission:Manage:<EntityId>",
    status: "Ready for integration",
    owner: "Unassigned",
    why: "Authorization leak on entity visibility",
  },
  {
    key: "RSH-3763",
    summary: "[IAM] Provide join groups functionality with pagination and search",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RSH-3239",
    summary:
      "[IAM] Bug: Duplicate permissions can be added for the same user with identical roles and modules",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RSH-4261",
    summary: "[IAM] Bug: Group delete failure exposes internal GUID in dialog and toast",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RSH-4251",
    summary: "IAM-Analyser integration issue",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RSH-4066",
    summary: "[IAM] Restart keycloak pod automatically in the pipeline when needed",
    status: "Ready for integration",
    owner: "Unassigned",
  },
  {
    key: "RSH-2451",
    summary: "AppSec: OpenSSL issue in IAM API",
    status: "Ready",
    owner: "Adam Ennis",
    why: "Security debt sitting Ready across three sprints and not committed to 2617",
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
  { key: "RSH-795", title: "Multi-Core Identity Provider (IDP)", status: "Ready", owner: "Unassigned" },
  { key: "RSH-4255", title: "Principal User — Make Work", status: "New", owner: "Dominik Czerwiński" },
  { key: "RSH-4256", title: "Web Content Accessibility Guidelines (WCAG) 2.2 Level AA", status: "New", owner: "Unassigned" },
  { key: "RSH-4258", title: "User Profile Management — Improvements", status: "New", owner: "Unassigned" },
  { key: "RSH-4262", title: "Personal Access Token (PAT)", status: "New", owner: "Jan-Hendrik Hühne" },
  { key: "RSH-4263", title: "Support for Third-Party Modules", status: "New", owner: "Unassigned" },
  { key: "RSH-321", title: "Support for Non-Standard Identity Providers (IDPs)", status: "New", owner: "Unassigned" },
  { key: "RSH-1314", title: "Support for Windows Server Deployments", status: "New", owner: "Unassigned" },
];

export const architecture: {
  intro: string;
  components: ArchitectureComponent[];
  flow: FlowStep[];
  decisions: DecisionRecord[];
} = {
  intro:
    "IAM is a security orchestration layer, not another user table. Products stop owning login, password, and two-factor authentication; they validate a token and read permissions. IAM owns users, groups, roles, and the permission model. Synthesized from Confluence IAM Integration v17 and Vizor Authentication and Authorization v62.",
  components: [
    {
      component: "Identity provider (Keycloak)",
      responsibility:
        "Stores identities and credentials, issues ID and access tokens, performs login, password, and two-factor flows for both security boundaries.",
      technology: "Keycloak, one realm per security boundary (Internal / External)",
      owner: "Celso Garcia",
    },
    {
      component: "IAM API",
      responsibility:
        "Owns users, groups, roles, modules, clients, and the permission model. Exposes the reach API so a caller only sees what its own role context allows.",
      technology: "Containerized service on the Regnology Supervision Hub platform",
      owner: "Dominik Czerwiński",
    },
    {
      component: "IAM UI",
      responsibility:
        "Administration surface for users, groups, permissions, join-group flows, and My profile. Delegated administration is the Principal User experience.",
      technology: "Platform front end, embedded in consuming products",
      owner: "Dominik Czerwiński",
    },
    {
      component: "Permission store and mirroring",
      responsibility:
        "Holds role + context (module, entity, entity group) grants and mirrors them into consumer-specific permission names via a mirroring config map.",
      technology: "IAM API persistence plus mirroring configuration",
      owner: "Shashank Prasad",
    },
    {
      component: "Vizor API Service (VAS)",
      responsibility:
        "Consumer-side token validation and authorization. Calls effectivePermissions and entityGroups to resolve what the caller may do in Vizor.",
      technology: "Vizor API Service with IAM audience and issuer configuration",
      owner: "Nico Romero (Vizor)",
    },
    {
      component: "Consuming products",
      responsibility:
        "Vizor Portal and Supervision Centre, Regulator 3, Analytics, Licensing, and Rconnect. They sync user and permissions from IAM on login, email, or any user action.",
      technology: "Container deployments with Security.Login.Type = IAM",
      owner: "Pawel Skrzypczynski",
    },
  ],
  flow: [
    {
      step: 1,
      title: "Login against the identity provider",
      detail:
        "The user authenticates against Keycloak in the correct security boundary — Internal for Supervision Centre, External for Portal and regulated firms.",
    },
    {
      step: 2,
      title: "Small ID token on the wire",
      detail:
        "The identity provider returns a deliberately small ID token. Custom permissions are kept out of it so HTTP header limits are never exceeded.",
    },
    {
      step: 3,
      title: "RFC 8693 token exchange",
      detail:
        "The product exchanges the ID token for an access token that carries custom_permissions, and attaches it to the request rather than to every session header.",
    },
    {
      step: 4,
      title: "Consumer validates issuer and audience",
      detail:
        "Vizor API Service validates the token issuer and audience. Where the audience settings are empty the token audience is effectively unchecked — see the deployment configuration table.",
    },
    {
      step: 5,
      title: "Resolve reach from role context",
      detail:
        "IAM derives caller reach from role entity context. A grant is role plus context: module, entity, and entity group. A direct group-id grant is a true OR-path regardless of scope overlap (RSH-3481).",
    },
    {
      step: 6,
      title: "Sync and mirror into the product",
      detail:
        "On login, email, or any user action the product re-syncs user and permissions from IAM. Where a consumer needs its own permission vocabulary, mirroring maps IAM grants onto it (RSH-2150).",
    },
  ],
  decisions: [
    {
      title: "Token exchange instead of fat tokens",
      detail:
        "Custom permissions blow HTTP header limits when carried in the ID token. RFC 8693 token exchange keeps the ID token small and moves custom_permissions to a request-scoped access token. This is the single most load-bearing architectural driver.",
      reference: { label: "IAM Integration v17", href: CONFLUENCE.integration },
    },
    {
      title: "Two security boundaries, never mixed",
      detail:
        "Internal (Supervision Centre, regulator staff) and External (Portal, regulated firms) are separate boundaries. Managing Vizor Portal users from Internal IAM is explicitly denied.",
      reference: { label: "Vizor Authentication and Authorization v62", href: CONFLUENCE.auth },
    },
    {
      title: "All-or-nothing per Vizor application",
      detail:
        "Security.Login.Type = IAM (uppercase) overrides every other login type. If a Vizor application turns IAM on, it applies to both Portal and Supervision Centre, and only in container deployments.",
      reference: { label: "IAM Integration v17", href: CONFLUENCE.integration },
    },
    {
      title: "Access is role plus context, not a flat role list",
      detail:
        "Every grant carries a module, an entity, and optionally an entity group. Entity-aware roles landed in RSH-3496; the migration of existing users and permissions onto this model is RSH-3042 and RSH-3503.",
      reference: { label: "RSH-3496", href: `${JIRA}/RSH-3496` },
    },
    {
      title: "Delegated administration is capped by the administrator's own roles",
      detail:
        "A Principal User may only manage users inside their entity scope, and only up to the roles they themselves hold. RSH-4220 is the open defect where that cap can be escaped.",
      reference: { label: "RSH-4220", href: `${JIRA}/RSH-4220` },
    },
  ],
};

export const implementation: {
  intro: string;
  notes: ImplementationNote[];
  config: ConfigRow[];
} = {
  intro:
    "How the architecture is actually being built, ticket by ticket. States are the Jira statuses in the 3 Sep 2026 snapshot, a week into sprint 2617.",
  notes: [
    {
      area: "Entity-aware permission model",
      detail:
        "Roles, vocabulary, parsing, and front end were made entity-aware, then the entity dimension was layered on top of the module dimension in the permissions view.",
      tickets: ["RSH-3496", "RSH-3500"],
      state: "Closed",
    },
    {
      area: "Reach API",
      detail:
        "Caller reach is derived from role entity context, with the [*] marker de-overloaded. Users, groups, and create-scope all read reach from the same source.",
      tickets: ["RSH-3497", "RSH-3499", "RSH-3498", "RSH-4242"],
      state: "Closed",
    },
    {
      area: "Entity scoping migration",
      detail:
        "Spikes to migrate existing users, groups, and permissions onto entity scoping and the new permission version. Vizor API Service already assumes the target model, so the migration is on the critical path for Principal User.",
      tickets: ["RSH-3042", "RSH-3503"],
      state: "Ready for integration (both)",
    },
    {
      area: "Scoped group administration",
      detail:
        "A direct group-id grant must behave as a true OR-path. Assigning a scoped permission from the IAM module to a scoped group is still broken.",
      tickets: ["RSH-3481", "RSH-4246"],
      state: "Ready for integration / Closed (RSH-4246 Closed in 2616)",
    },
    {
      area: "Authorization defects",
      detail:
        "Privilege escalation via View + Manage Permissions, entity visibility without Permission:Manage, duplicate permissions for identical role and module, and an internal GUID leaked in group-delete errors.",
      tickets: ["RSH-4220", "RSH-4244", "RSH-3239", "RSH-4261"],
      state: "Ready for integration (all four)",
    },
    {
      area: "Permission mirroring",
      detail:
        "Maps IAM grants onto consumer permission names through a mirroring config map. The role value and module name case bug was fixed; Rconnect still needs country in the permission model.",
      tickets: ["RSH-2150", "RSH-3238"],
      state: "In Implementation",
    },
    {
      area: "Self-service and profile",
      detail:
        "My profile, user creation with an optional initial permission, and the user guide. Legacy profile, change-password, and two-factor pages in the product are redirected or denied once IAM is on.",
      tickets: ["RSH-105", "RSH-793", "RSH-3479", "RSH-4221"],
      state: "Closed / In Implementation",
    },
    {
      area: "Unscoped module permissions",
      detail:
        "A module-level grant that does not carry an entity scope, plus a dedicated module permission manager role so a product can administer its own permissions.",
      tickets: ["RSH-4214", "RSH-4215"],
      state: "In PO Review / In Implementation",
    },
    {
      area: "Application security",
      detail:
        "OpenSSL issue in the IAM API has been Ready across three sprints and was not committed to 2617. Cheap to close and highly visible as security debt.",
      tickets: ["RSH-2451"],
      state: "Ready (not in 2617)",
    },
    {
      area: "Consumer integration",
      detail:
        "Analyser integration still sits Ready for integration and still blocks the Analytics consumer. Dev-cluster IAM (RSH-2453) has reached Quality Review in 2617. RForge scaffolding and ContextData OpenAPI have not moved.",
      tickets: ["RSH-4251", "RSH-2453", "RSH-3515", "RSH-3137"],
      state: "Ready for integration / In Quality Review",
    },
  ],
  config: [
    {
      setting: "Security.Login.Type",
      value: "IAM (uppercase)",
      meaning:
        "Switches the Vizor application onto IAM. Overrides every other login type for both Supervision Centre and Portal. Container deployments only.",
    },
    {
      setting: "VAS_IAM_INTERNAL_AUDIENCE",
      value: "empty in all known environments",
      meaning:
        "Vizor API Service is not validating the token audience for the Internal boundary. Treat as a go-live gate before the next customer environment.",
      warning: true,
    },
    {
      setting: "VAS_IAM_EXTERNAL_AUDIENCE",
      value: "empty in all known environments",
      meaning: "Same exposure as the internal audience, on the Portal / regulated-firm boundary.",
      warning: true,
    },
    {
      setting: "IAM issuer",
      value: "manual SQL fix-up in P5.8.1",
      meaning:
        "Issuer auto-population did not work and needed a hand-applied SQL correction. Anything that recreates the environment must reapply it.",
      warning: true,
    },
    {
      setting: "Permission mirroring config map",
      value: "per-consumer mapping",
      meaning:
        "Maps IAM role and module names onto consumer permission names. Case sensitivity here caused RSH-3238.",
    },
  ],
};

export const deployment: {
  intro: string;
  targets: DeploymentTarget[];
  pipeline: string[];
} = {
  intro:
    "IAM ships as containers on the Regnology Supervision Hub platform. There is no supported non-container path today, which is why Windows Server deployments (RSH-1314) are still on the later horizon and why the dev cluster is the proving ground for every consumer.",
  targets: [
    {
      environment: "Dev cluster",
      topology: "All modules pointed at IAM and the platform, Keycloak pod alongside the IAM API",
      state: "In Quality Review",
      note: "RSH-2453 is the integration proving ground for Vizor, Analytics, and Rconnect. It has spilled across five sprints and is now in Quality Review.",
    },
    {
      environment: "Continuous integration pipeline",
      topology: "Keycloak pod restarted automatically when the pipeline needs it",
      state: "Ready for integration",
      note: "RSH-4066 removes the manual restart that was destabilizing every module integration run. Left 2616 unassigned.",
    },
    {
      environment: "Vizor container deployments",
      topology: "Portal and Supervision Centre on one identity provider, two security boundaries",
      state: "In Implementation",
      note: "REG-49745. Audience validation must be switched on before an environment counts as hardened.",
    },
    {
      environment: "Customer environments (P5.8.1 baseline)",
      topology: "Containers with the IAM issuer applied by SQL fix-up",
      state: "Manual step required",
      note: "Documented in Vizor Authentication and Authorization v62. Treat the fix-up as part of the deployment runbook until it is automated.",
    },
    {
      environment: "Windows Server",
      topology: "Not supported",
      state: "New",
      note: "RSH-1314. Until this lands, any customer that cannot run containers cannot adopt IAM.",
    },
  ],
  pipeline: [
    "Build the IAM API and IAM UI containers on the Regnology Supervision Hub platform release train (26.3.0.00 cut 27 Aug 2026; stabilization now tracked as 26.4 under RSH-4254).",
    "Deploy Keycloak plus the IAM API into the target cluster; the pipeline restarts the Keycloak pod when required (RSH-4066).",
    "Point each module at IAM and the platform in the dev cluster and prove the integration there first (RSH-2453).",
    "Set Security.Login.Type = IAM on the consuming application, then set the internal and external audience values.",
    "Apply the issuer SQL fix-up where P5.8.1 auto-population did not run, then re-verify token issuer and audience.",
    "Sync users and permissions, apply the mirroring config map for consumers that need their own vocabulary, and verify reach in the IAM UI.",
  ],
};

export const roadmap: RoadmapPhase[] = [
  {
    phase: "Phase 1 — Foundations",
    window: "Mar 2025 – Jan 2026",
    state: "Closed",
    goal:
      "Stand up shared authentication, authorization, and self-service so a product can log in against IAM at all.",
    items: [
      { key: "RSH-97", title: "Authentication", status: "Closed", note: "Identity provider, login, password, two-factor" },
      { key: "RSH-100", title: "Authorization and module roles", status: "Closed", note: "Role and module permission model" },
      { key: "RSH-105", title: "User self-service", status: "Closed", note: "My profile and self-service flows" },
      { key: "RSH-99", title: "RSH Licensing on IAM", status: "Closed", note: "First production consumer" },
      { key: "RSH-1488", title: "Required endpoints for Regulator 3", status: "Closed", note: "Unblocked R3 Data Collection (RSH-718)" },
    ],
    exit: [
      "Licensing and R3 Data Collection are live on IAM.",
      "Authentication, authorization, and self-service epics are Closed.",
    ],
  },
  {
    phase: "Phase 2 — Delegated administration and mirroring",
    window: "Jan 2026 – Dec 2026",
    state: "In Implementation",
    goal:
      "Make IAM good enough that Vizor and Regulator 3 can retire local user management: entity scoping, Principal User, and permission mirroring.",
    items: [
      { key: "RSH-1025", title: "Close feature gaps vs R3 / Vizor / eReg user management", status: "Closed", note: "Split into RSH-1846 and cloned as RSH-4255" },
      { key: "RSH-1323", title: "Improvements 26.2.0.00", status: "Closed", note: "Release-scoped improvements" },
      { key: "RSH-1846", title: "Principal User (user manager)", status: "In Implementation", note: "Blocked in practice by RSH-4220 and entity scoping" },
      { key: "RSH-2150", title: "Permission mirroring", status: "In Implementation", note: "Must label — Central Bank of Barbados / Rconnect" },
      { key: "RSH-793", title: "User profile management", status: "In Implementation", note: "Improvements tracked separately as RSH-4258" },
      { key: "RSH-4221", title: "IAM user guide", status: "In Implementation", note: "Kartik Sharma" },
      { key: "RSH-3042", title: "Entity scoping migration", status: "Ready for integration", note: "Vizor API Service already assumes this model" },
      { key: "RSH-429", title: "Defects and tech debt backlog", status: "Ready", note: "Standing quality budget" },
      { key: "RSH-2169", title: "Entity group inheritance", status: "Blocked", note: "Blocked on Master Data Management membership expansion" },
    ],
    exit: [
      "Privilege escalation RSH-4220 is Closed.",
      "Entity scoping and permission migration are complete (RSH-3042, RSH-3503).",
      "A Principal User can administer users inside an entity scope without escaping their own roles.",
      "Mirrored permissions satisfy the Central Bank of Barbados / Rconnect contract, including country in the permission model.",
    ],
  },
  {
    phase: "Phase 2.5 — Stabilization for release 26.3",
    window: "Aug 2026 – Dec 2026",
    state: "New / High / Must",
    goal:
      "Make the shipped capability actually work in customer environments rather than adding scope. This is the working-state track that sits under the RSH-96 strategy initiative.",
    items: [
      { key: "RSH-4254", title: "Stabilization epic", status: "New", note: "Retitled Stabilization Release — 26.4" },
      { key: "RSH-4255", title: "Principal User — make work", status: "New", note: "Now assigned to Dominik Czerwiński; the real go-live path" },
      { key: "RSH-2451", title: "OpenSSL application security", status: "Ready", note: "Ready across three sprints; not in 2617" },
      { key: "RSH-2453", title: "All modules on IAM in the dev cluster", status: "In Quality Review", note: "Integration proving ground" },
      { key: "RSH-4251", title: "IAM–Analyser integration", status: "Ready for integration", note: "Blocks the Analytics consumer (RSH-719); left 2616 unassigned" },
    ],
    exit: [
      "Audience validation is switched on and the issuer fix-up is automated.",
      "Every module runs against IAM in the dev cluster.",
      "No open Critical or High authorization defects.",
    ],
  },
  {
    phase: "Phase 3 — Platform completeness",
    window: "2027",
    state: "New / Ready",
    goal:
      "Broaden reach once delegated administration is real: tokens for machines, accessibility, non-standard identity providers, and non-container deployments.",
    items: [
      { key: "RSH-4262", title: "Personal access tokens", status: "New", note: "Jan-Hendrik Hühne" },
      { key: "RSH-4256", title: "Web Content Accessibility Guidelines 2.2 Level AA", status: "New", note: "Unassigned" },
      { key: "RSH-795", title: "Multi-core identity provider", status: "Ready", note: "Unassigned" },
      { key: "RSH-321", title: "Non-standard identity providers", status: "New", note: "Unassigned" },
      { key: "RSH-1314", title: "Windows Server deployments", status: "New", note: "Unblocks non-container customers" },
      { key: "RSH-4263", title: "Third-party module support", status: "New", note: "Unassigned" },
      { key: "RSH-794", title: "Translations", status: "Ready", note: "Unassigned" },
      { key: "RFS-1688", title: "RFS × RSH shared IAM", status: "New", note: "Not scheduled" },
    ],
    exit: [
      "Nothing in this phase should start before the Phase 2.5 exit criteria are met.",
    ],
  },
];

export const consumers = [
  { name: "RSH Licensing", key: "RSH-99", state: "Closed", note: "First production consumer" },
  { name: "R3 Data Collection", key: "RSH-718", state: "Closed", note: "Required endpoints shipped (RSH-1488)" },
  { name: "Vizor Licensing & Automatic Exchange of Information (AEOI)", key: "REG-49745", state: "In Implementation", note: "IAM Integration doc v17 · Authentication and Authorization v62" },
  { name: "R3 × RSH Shared IAM", key: "REG-48802", state: "In Implementation", note: "Work package still open" },
  { name: "RSH Analytics", key: "RSH-719", state: "In Implementation", note: "Target 26.2 · blocked by RSH-4251" },
  { name: "Rconnect / Central Bank of Barbados (CBBB)", key: "RSH-2150", state: "In Implementation", note: "Permission mirroring is the Must / Central Bank of Barbados path" },
  { name: "RFS", key: "RFS-1688", state: "New", note: "Not scheduled" },
];

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
  { id: "wcag", label: "Web Content Accessibility Guidelines 2.2 AA", ticket: "RSH-4256", start: "2027-01-15", end: "2027-04-30", status: "later", lane: "Later" },
  { id: "multicore", label: "Multi-Core Identity Provider", ticket: "RSH-795", start: "2027-02-01", end: "2027-06-30", status: "later", lane: "Later" },
  { id: "win", label: "Windows Server deployments", ticket: "RSH-1314", start: "2027-03-01", end: "2027-08-15", status: "later", lane: "Later" },
];

export const stakeholderGantt: GanttItem[] = [
  { id: "lic", label: "RSH Licensing live on IAM", ticket: "RSH-99", start: "2025-06-01", end: "2025-12-15", status: "done", lane: "Shipped" },
  { id: "r3dc", label: "R3 Data Collection endpoints", ticket: "RSH-718", start: "2025-09-01", end: "2026-05-28", status: "done", lane: "Shipped" },
  { id: "vizor", label: "Vizor Portal + Supervision Centre", ticket: "REG-49745", start: "2025-10-10", end: "2026-12-15", status: "active", lane: "In market" },
  { id: "r3share", label: "R3 × RSH Shared IAM WP", ticket: "REG-48802", start: "2026-01-15", end: "2026-12-15", status: "active", lane: "In market" },
  { id: "cbbb", label: "Rconnect Central Bank of Barbados — mirrored permissions", ticket: "RSH-2150", start: "2026-03-01", end: "2026-11-30", status: "active", lane: "Must / Central Bank of Barbados" },
  { id: "an", label: "RSH Analytics 26.2", ticket: "RSH-719", start: "2026-04-01", end: "2026-10-31", status: "active", lane: "In market" },
  { id: "rfs", label: "RFS × RSH Shared IAM", ticket: "RFS-1688", start: "2027-01-08", end: "2027-06-30", status: "later", lane: "Unscheduled" },
];

export const stakeholders = [
  { name: "Robert Binder", role: "Initiative owner", interest: "RSH-96 Shared Identity and Access Management · Scale (RSH-179)", raci: "A", org: "Regnology Supervision Hub Platform" },
  { name: "Adam Ennis", role: "Engineering lead", interest: "Phase 2 epics, application security, Principal User", raci: "R / A (delivery)", org: "Regnology Supervision Hub Identity and Access Management" },
  { name: "Anke Dohse", role: "Release and technical governance / delivery governance", interest: "Staffing, onboarding FRR + hire", raci: "C", org: "Product ops" },
  { name: "Dominik Czerwiński", role: "Identity and Access Management permissions / reach API", interest: "Privilege escalation, scoped groups", raci: "R", org: "Regnology Supervision Hub Identity and Access Management" },
  { name: "Celso Garcia", role: "Entity-aware roles / Keycloak operations", interest: "RSH-3496, Keycloak restart, group-id grant", raci: "R", org: "Regnology Supervision Hub Identity and Access Management" },
  { name: "Shashank Prasad", role: "Entity scoping / mirroring", interest: "RSH-3042, RSH-3503, mirroring bugs", raci: "R", org: "Regnology Supervision Hub Identity and Access Management" },
  { name: "Pawel Skrzypczynski", role: "Platform integration", interest: "Dev cluster, Analyser, module rollout", raci: "R", org: "Regnology Supervision Hub Platform" },
  { name: "Kartik Sharma", role: "Documentation", interest: "Identity and Access Management User Guide (RSH-4221)", raci: "R", org: "Regnology Supervision Hub Identity and Access Management" },
  { name: "Jan-Hendrik Hühne", role: "Personal Access Token owner", interest: "RSH-4262 — later horizon", raci: "C", org: "Regnology Supervision Hub Platform" },
  { name: "Nico Romero", role: "Vizor Authentication and Authorization author", interest: "Confluence v62 (May 2026)", raci: "C", org: "Vizor" },
  { name: "Malachy Walsh", role: "IAM Integration author", interest: "Confluence v17 — undocumented gaps", raci: "C", org: "Vizor" },
  { name: "Iryna Shaban", role: "Rconnect IAM consumer", interest: "What IAM Service Offers · country in permissions", raci: "C", org: "Rconnect" },
  { name: "Central Bank of Barbados / Rconnect", role: "Customer forcing function", interest: "Mirrored permissions, not implicit ones", raci: "I / C", org: "External" },
];

export const raciRows = [
  ["Initiative strategy (RSH-96)", "A", "C", "I", "I", "C"],
  ["Sprint commitment & delivery", "I", "A", "R", "I", "I"],
  ["Principal User (RSH-1846 / 4255)", "A", "R", "R", "C", "C"],
  ["Permission mirroring / Central Bank of Barbados", "A", "R", "R", "C", "I"],
  ["Privilege-escalation & AppSec", "I", "A", "R", "I", "A"],
  ["Entity scoping / Master Data Management inheritance", "C", "A", "R", "C", "I"],
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
    why: "Touches every Identity and Access Management tenant. Left 2616 at Ready for integration, still unassigned and not Closed. Highest near-term return on investment and a Principal User prerequisite.",
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
    why: "Central Bank of Barbados / Rconnect Must. Revenue and client-satisfaction forcing function.",
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
    why: "Blocked on Master Data Management (MDM). Do not staff until MDM membership is unblocked in writing.",
    bottleneck: true,
  },
  {
    item: "OpenSSL AppSec",
    ticket: "RSH-2451",
    reach: 8,
    impact: 2,
    confidence: 0.85,
    effort: 2,
    why: "Ready across three sprints and not even committed to 2617. Cheap to close; looks like unmanaged security debt.",
    bottleneck: false,
  },
  {
    item: "Personal Access Token / accessibility / Multi-Core Identity Provider",
    ticket: "RSH-4262",
    reach: 4,
    impact: 1,
    confidence: 0.55,
    effort: 8,
    why: "Platform completeness, not the next 90 days. Sequence after Principal User + hardening.",
    bottleneck: false,
  },
];

export function riceScore(row: (typeof rice)[number]) {
  return (row.reach * row.impact * row.confidence) / row.effort;
}

export const bottlenecks = [
  {
    title: "Master Data Management (MDM) entity-group membership",
    ticket: "RSH-2169",
    detail:
      "Vizor API Service (VAS) entityGroups cannot expand members. Principal User and scoped permissions will lie about reach until Master Data Management (MDM) inheritance is explicit or deferred.",
  },
  {
    title: "Audience validation is off",
    ticket: "Vizor API Service config",
    detail:
      "VAS_IAM_INTERNAL_AUDIENCE / EXTERNAL default empty in all known environments. Issuer auto-population needed a manual SQL fix-up in P5.8.1. Treat as a go-live risk.",
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
