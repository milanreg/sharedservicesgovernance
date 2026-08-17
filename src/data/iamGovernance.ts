import {
  BOARD,
  CONFLUENCE,
  JIRA,
  SNAPSHOT,
  backlogGantt,
  bottlenecks,
  consumers,
  leftoverFrom2615,
  phase2,
  previousSprintClosed,
  raciHeaders,
  raciRows,
  rice,
  sprint,
  sprintTickets,
  stakeholderGantt,
  stakeholders,
} from "./iam";
import type { ProjectGovernance, Risk, Ticket } from "../template/types";

function jira(key: string) {
  return `${JIRA}/${key}`;
}

const TICKET_RISKS: Record<string, Risk> = {
  "RSH-4220": {
    level: "red",
    reason:
      "Privilege escalation: View + Manage Permissions can self-grant Manage Users/Groups/Clients.",
    mitigation:
      "In Quality Review with Dominik Czerwiński. Do not ship Principal User until this is Closed.",
    assessment:
      "RICE 21.6 — highest near-term return on investment. Touches every Identity and Access Management tenant and is a Principal User go-live blocker.",
    references: [
      { label: "RSH-4220", href: jira("RSH-4220") },
      { label: "RSH-1846 Principal User", href: jira("RSH-1846") },
    ],
  },
  "RSH-2169": {
    level: "red",
    reason: "Entity-group inheritance is blocked on Master Data Management (MDM); Vizor API Service (VAS) cannot expand members.",
    mitigation:
      "Do not staff until Master Data Management (MDM) membership is unblocked in writing, or explicitly defer inheritance.",
    assessment:
      "RICE 0.67 at 40% confidence. Principal User reach will be incorrect until this is resolved or deferred.",
    references: [
      { label: "RSH-2169", href: jira("RSH-2169") },
      { label: "Vizor Authentication and Authorization entityGroups", href: CONFLUENCE.auth },
    ],
  },
  "RSH-2451": {
    level: "amber",
    reason: "OpenSSL AppSec has sat Ready across two sprints.",
    mitigation: "Close this sprint under Adam Ennis — low effort, high visibility.",
    assessment: "RICE 3.4. Cheap to finish; looks like unmanaged security debt if it slips again.",
    references: [{ label: "RSH-2451", href: jira("RSH-2451") }],
  },
  "RSH-4251": {
    level: "amber",
    reason: "Analytics 26.2 cannot complete without the Analyser IAM integration.",
    mitigation: "Keep Pawel Skrzypczynski on this; do not claim Analytics live until Closed.",
    assessment: "Consumer RSH-719 is In Implementation and blocked by this ticket.",
    references: [
      { label: "RSH-4251", href: jira("RSH-4251") },
      { label: "RSH-719 Analytics", href: jira("RSH-719") },
    ],
  },
  "RSH-4244": {
    level: "amber",
    reason: "Authorization leak: entity visibility without Permission:Manage. Unassigned.",
    mitigation: "Assign before sprint end. Treat as an authz defect, not UX.",
    assessment: "Unowned Ready work in an active sprint is a slip risk.",
    references: [{ label: "RSH-4244", href: jira("RSH-4244") }],
  },
  "RSH-3763": {
    level: "amber",
    reason: "Critical join-groups pagination is still Ready and unassigned; RSH-4260 closed as duplicate.",
    mitigation: "Pull into WIP this sprint. Owner is still empty.",
    assessment: "Closing the duplicate without landing pagination leaves the UX defect open.",
    references: [
      { label: "RSH-3763", href: jira("RSH-3763") },
      { label: "RSH-4260 (closed duplicate)", href: jira("RSH-4260") },
    ],
  },
  "RSH-3042": {
    level: "amber",
    reason: "Entity-scoping spike spilled from 2615. Principal User depends on this model.",
    mitigation: "Protect through Quality Review with Shashank Prasad.",
    assessment: "VAS effectivePermissions already assumes entity scoping.",
    references: [
      { label: "RSH-3042", href: jira("RSH-3042") },
      { label: "RSH-1846", href: jira("RSH-1846") },
    ],
  },
  "RSH-2453": {
    level: "amber",
    reason: "Dev-cluster IAM rollout has spilled across sprints.",
    mitigation: "Keep as integration proving ground; do not start new consumers until it lands.",
    assessment: "Vizor, Analytics, and Rconnect all need this path proven.",
    references: [{ label: "RSH-2453", href: jira("RSH-2453") }],
  },
  "RSH-3503": {
    level: "amber",
    reason: "Permission-version migration spilled from 2615 and is still In Implementation.",
    mitigation: "Pair with RSH-3042; same owner (Shashank Prasad).",
    assessment: "Companion spike to entity scoping — slipping one slips both.",
    references: [{ label: "RSH-3503", href: jira("RSH-3503") }],
  },
  "RSH-3481": {
    level: "amber",
    reason: "Group-id OR-path spilled from 2615; scoped-group permission model is incomplete without it.",
    mitigation: "Keep Celso Garcia on it through Implementation.",
    references: [{ label: "RSH-3481", href: jira("RSH-3481") }],
  },
};

function withRisk(ticket: Ticket): Ticket {
  const risk = TICKET_RISKS[ticket.key];
  return risk ? { ...ticket, risk } : ticket;
}

export const iamGovernance: ProjectGovernance = {
  slug: "iam",
  name: "IAM",
  fullName: "Identity and Access Management",
  rag: "Amber",
  platform: "Regnology Supervision Hub (RSH) Platform",
  summary:
    "Shared authentication and authorization for Regnology solutions. Foundations shipped; Principal User and mirroring still decide whether products retire local user management.",
  initiativeKey: "RSH-96",
  ticketBaseUrl: JIRA,
  boardUrl: BOARD,
  snapshot: SNAPSHOT,
  sources:
    'Jira: project = RSH AND summary ~ "[IAM]" (634 done, 209 open) · sprint in openSprints() on board 2936. Confluence: IAM Integration (v17, Jan 2026), Vizor Authentication and Authorization (v62, May 2026), What IAM Service Offers (v6).',
  populated: true,
  sprint: {
    name: "Regnology Supervision Hub Platform 2616",
    start: sprint.start,
    end: sprint.end,
    committed: sprint.committed,
    done: sprint.done,
    inProgress: sprint.inProgress,
    blocked: sprint.blocked,
    narrative: `Active ${sprint.start} – ${sprint.end} on Regnology Supervision Hub board 2936. Sixteen Identity and Access Management items committed. Snapshot ${SNAPSHOT}.`,
    headline:
      "Highest delivery risk: privilege escalation RSH-4220 in Quality Review, plus RSH-2169 blocked on Master Data Management (MDM). Five of sixteen tickets are unassigned.",
  },
  tickets: sprintTickets.map(withRisk),
  previousSprint: {
    name: "Regnology Supervision Hub Platform 2615",
    dates: "30 Jul – 13 Aug 2026",
    narrative:
      "Previous sprint closed a large reach-API slice. Six of sixteen 2616 items were already on a closed sprint — 38% of the current IAM commitment is carry-over.",
    cards: [
      {
        title: "Closed in 2615",
        body: "Reach API, entity dimension on permissions, optional initial permission, mirroring case bug. Entity-aware roles finished in 2616.",
      },
      {
        title: "Carried into 2616",
        body: "Entity scoping, permission migration, group-id OR-path, dev-cluster IAM, OpenSSL. One of six closed this sprint so far.",
      },
      {
        title: "Left 2615 without landing in 2616",
        body: "RForge scaffolding and ContextData OpenAPI at Ready for integration; unscoped Principal User groups at Product Owner Accepted.",
      },
    ],
    closed: previousSprintClosed,
    leftover: leftoverFrom2615,
  },
  overview: {
    intro: `Shared Identity and Access Management for Regnology solutions. Synthesized from Jira initiative RSH-96, Phase 2 RSH-903, Confluence IAM Integration v17, Vizor Authentication and Authorization v62, and What IAM Service Offers.`,
    callout:
      "IAM is the common authentication and authorization module for regulator and regulated users. If a Vizor application turns it on, it must be used for both Portal and Supervision Centre, and only in containers. Foundations shipped. Principal User, entity scoping, permission mirroring, and stabilization still decide whether products can retire local user management. Initiative RAG: Amber (Jan 2026) — scope creep vs original plan.",
    vision: [
      "Centralize identity and permissions so Vizor, R3, and other solutions stop owning login, user admin, password, and 2FA. IAM is a security orchestration layer: products validate tokens; IAM owns users, groups, and permissions.",
      "Access is role plus context (module, entity, entity group), with two security boundaries — Internal (Supervision Centre) and External (Portal / firms). Delegated administration is a Principal User who only manages users in their entity scope, only up to their own roles.",
      "Owner: Robert Binder. Engineering lead: Adam Ennis. Parent: RSH-179 Scale. Labels: Must, CBBB.",
    ],
    contract: [
      "Flip Security.Login.Type = IAM (uppercase). That overrides every other login type for VSC and VP. On login, email, or any user action, the product syncs user and permissions from IAM first.",
      "Legacy profile, change-password, and 2FA pages are redirected or denied. Rconnect expects IAM to provide authN/Z, permission UI/API, IDP storage, My profile, and manage-users — and still needs country in the permission model.",
      "Architectural driver: custom permissions blow HTTP header limits. RFC 8693 token exchange keeps a small ID token on the wire and an access token with custom_permissions on the request only.",
    ],
    layers: [
      { layer: "Authentication", key: "RSH-97", state: "Closed" },
      { layer: "Authorization", key: "RSH-100", state: "Closed" },
      { layer: "Self-service", key: "RSH-105", state: "Closed" },
      {
        layer: "Phase 2 (2026)",
        key: "RSH-903",
        state: "In Implementation · 3 closed / 4 in implementation / 3 ready / 7 new",
      },
      { layer: "Stabilization", key: "RSH-4254", state: "New · High · Must · PL 26.3" },
    ],
    consumers,
    epics: phase2,
  },
  backlogGantt: {
    intro:
      "Bars are derived from Phase 1 closed epics, Phase 2 children of RSH-903, current sprint spikes, and unscheduled New items. Dates are planning horizons, not Jira due dates (those fields are empty on these epics).",
    items: backlogGantt,
    caption:
      "Source: RSH-96 / RSH-903 children · RSH board 2936 · snapshot 16 Aug 2026. Today sits in Q3 2026.",
  },
  stakeholderGantt: {
    intro:
      "Integration roadmap for product delivery with other apps. Data points are Jira implementation links on RSH-96 plus Confluence consumer contracts. Use this view with release and technical governance, Central Bank of Barbados, and consuming product owners — not the engineering backlog Gantt.",
    highlights: [
      {
        title: "Shipped value",
        body: "Licensing and R3 Data Collection already consume IAM. Phase 1 authN/Z is Closed.",
      },
      {
        title: "2026 forcing function",
        body: "Central Bank of Barbados / Rconnect needs mirrored permissions. Vizor must stay all-or-nothing (Portal and Supervision Centre, containers only).",
      },
      {
        title: "Unscheduled",
        body: "RFS-1688 is New. Personal Access Tokens, Web Content Accessibility Guidelines, Multi-Core Identity Provider, and Windows Server sit after Principal User.",
      },
    ],
    items: stakeholderGantt,
    caption:
      "Source: RSH-96 issue links · REG-49745 / REG-48802 / RFS-1688 · Confluence IAM Integration v17. Snapshot 16 Aug 2026.",
  },
  stakeholders,
  raci: { headers: raciHeaders, rows: raciRows },
  rice,
  bottlenecks: bottlenecks.map((b) => {
    const ticketRisk = b.ticket.startsWith("RSH-") ? TICKET_RISKS[b.ticket] : undefined;
    const extra: Record<string, Risk> = {
      "Vizor API Service config": {
        level: "red",
        reason: "Audience validation is disabled in known environments.",
        mitigation:
          "Set VAS_IAM_INTERNAL_AUDIENCE / EXTERNAL (Vizor API Service audience) and apply the P5.8.1 issuer SQL fix-up before calling an environment production-hardened.",
        assessment:
          "Documented in Vizor Authentication and Authorization v62. Empty audience config means Vizor API Service is not validating token audience.",
        references: [{ label: "Vizor Authentication and Authorization v62", href: CONFLUENCE.auth }],
      },
      "RSH-1025": {
        level: "amber",
        reason: "Closed epic does not mean the capability is in market.",
        mitigation: "Track RSH-1846 and the RSH-4255 Make Work clone as the real Principal User path.",
        assessment: "R3 Keycloak removal remains New.",
        references: [
          { label: "RSH-1025", href: jira("RSH-1025") },
          { label: "RSH-4255", href: jira("RSH-4255") },
        ],
      },
      "Confluence v17": {
        level: "amber",
        reason: "Integration doc still flags undocumented or unsupported paths.",
        mitigation:
          "Split external vs internal user docs. Document registration, migration (or not supported), and managing Vizor Portal users from Internal Identity and Access Management deny.",
        assessment: "IAM Integration v17 (Jan 2026) lists these as open documentation gaps.",
        references: [{ label: "IAM Integration v17", href: CONFLUENCE.integration }],
      },
      "RSH-4254": {
        level: "amber",
        reason: "Strategy initiative and stabilization epic are two tracks for one product.",
        mitigation: "Treat RSH-4254 as the 26.3 working-state epic; keep RSH-96 as the strategy parent.",
        assessment: "RSH-96 RAG Amber (Jan 2026) for scope creep vs original plan.",
        references: [
          { label: "RSH-96", href: jira("RSH-96") },
          { label: "RSH-4254", href: jira("RSH-4254") },
        ],
      },
    };
    return { ...b, risk: ticketRisk ?? extra[b.ticket] };
  }),
  next90days:
    "Protect the next 90 days: sequence privilege-escalation, OpenSSL, entity scoping, mirroring, and audience/issuer hardening before Personal Access Tokens, Web Content Accessibility Guidelines 2.2, translations, or third-party modules. Treat Principal User (RSH-4255) as the milestone that lets Vizor and Regulator 3 turn local user management off.",
  projectSummary: {
    jiraUrl: "https://regnology-cloud.atlassian.net/jira/software/c/projects/RSH/summary",
    done: 634,
    open: 209,
    highPriorityOpen: 46,
    unassignedOpen: 173,
    epics: 44,
    currentRelease: {
      name: "26.3.0.00 Regnology Supervision Hub Platform",
      date: "27 Aug 2026",
      released: false,
    },
    lastRelease: {
      name: "26.2.0.00 Regnology Supervision Hub Platform",
      date: "28 May 2026",
    },
    narrative:
      "Identity and Access Management sits on the Regnology Supervision Hub (RSH) board. Phase 1 authentication and authorization shipped. Initiative RSH-96 is Amber because of scope creep versus the original plan. Current platform release 26.3 is unreleased (27 Aug 2026). Counts below use Jira JQL project = RSH AND summary ~ \"[IAM]\".",
  },
  pmFocus: {
    thisSprint: [
      "Close privilege-escalation RSH-4220 in Quality Review before any Principal User demo.",
      "Assign the five unassigned sprint tickets (RSH-4244, RSH-3763, RSH-2169, RSH-4261, RSH-3239).",
      "Keep entity-scoping RSH-3042 through Quality Review — Principal User depends on it.",
      "Do not staff Master Data Management (MDM) inheritance RSH-2169 until membership expansion is unblocked in writing.",
      "Finish OpenSSL AppSec RSH-2451 this sprint; it has sat Ready across two sprints.",
    ],
    sequence: [
      {
        order: 1,
        item: "Privilege-escalation fix",
        ticket: "RSH-4220",
        why: "Go-live blocker for delegated Principal User administration. Highest near-term return on investment.",
      },
      {
        order: 2,
        item: "OpenSSL application security",
        ticket: "RSH-2451",
        why: "Low effort, high visibility. Cheap to close; looks like unmanaged security debt if it spills again.",
      },
      {
        order: 3,
        item: "Entity-scoping migration",
        ticket: "RSH-3042",
        why: "Vizor API Service (VAS) already assumes this model. Unblocks Principal User.",
      },
      {
        order: 4,
        item: "Permission mirroring for Central Bank of Barbados",
        ticket: "RSH-2150",
        why: "Must label. Rconnect at Barbados needs mirrored permissions, not implicit ones.",
      },
      {
        order: 5,
        item: "Principal User — Make Work",
        ticket: "RSH-4255",
        why: "Kill-switch for Vizor and Regulator 3 local user management. Sequence after 1–4.",
      },
    ],
    questions: [
      "Will Master Data Management (MDM) unblock entity-group membership in 26.3, or do we defer inheritance in writing?",
      "What is the acceptance criteria for Principal User so Vizor can turn Security.Login.Type = IAM and retire local user management?",
      "Is audience validation (empty VAS_IAM_INTERNAL_AUDIENCE / EXTERNAL) a go-live gate for the next customer environment?",
      "Should Personal Access Tokens, Web Content Accessibility Guidelines 2.2, and Multi-Core Identity Provider stay out of 26.3?",
    ],
  },
};
