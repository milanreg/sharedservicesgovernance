import {
  BOARD,
  CONFLUENCE,
  JIRA,
  SNAPSHOT,
  architecture,
  backlogGantt,
  bottlenecks,
  consumers,
  deployment,
  implementation,
  leftoverFrom2617,
  phase2,
  previousSprintClosed,
  raciHeaders,
  raciRows,
  rice,
  roadmap,
  sprint,
  sprintTickets,
  stakeholderGantt,
  stakeholders,
} from "./iam";
import type { ProjectGovernance, Risk, Ticket } from "../template/types";

function jira(key: string) {
  return `${JIRA}/${key}`;
}

export const TICKET_RISKS: Record<string, Risk> = {
  "RSH-4220": {
    level: "amber",
    reason:
      "Privilege escalation is Closed in Jira. Confirm it is in a released 26.4 build before treating delegated admin as unblocked.",
    mitigation:
      "Do not demo Principal User against an environment that has not taken this fix. The ticket closed unassigned.",
    assessment:
      "Highest near-term return on investment. Closed is not the same as verified in a customer build.",
    references: [
      { label: "RSH-4220", href: jira("RSH-4220") },
      { label: "RSH-4255 Principal User Make Work", href: jira("RSH-4255") },
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
    reason: "OpenSSL AppSec sat Ready across three sprints and is finally on the 2618 board, still Ready.",
    mitigation: "Close it this sprint under Adam Ennis — low effort, high visibility.",
    assessment: "RICE 3.4. Being committed is not the same as being Closed.",
    references: [{ label: "RSH-2451", href: jira("RSH-2451") }],
  },
  "RSH-4251": {
    level: "amber",
    reason: "Analytics 26.2 cannot complete without the Analyser IAM integration.",
    mitigation: "Ready for integration but unassigned; do not claim Analytics live until Closed.",
    assessment: "Consumer RSH-719 is In Implementation and blocked by this ticket.",
    references: [
      { label: "RSH-4251", href: jira("RSH-4251") },
      { label: "RSH-719 Analytics", href: jira("RSH-719") },
    ],
  },
  "RSH-4244": {
    level: "amber",
    reason: "Authorization leak: entity visibility without Permission:Manage. Still unassigned.",
    mitigation: "Ready for integration. Treat as an authz defect, not UX, and name an owner for the integration itself.",
    assessment: "An unowned authz fix riding into a release is a verification risk, not just a slip risk.",
    references: [{ label: "RSH-4244", href: jira("RSH-4244") }],
  },
  "RSH-3763": {
    level: "amber",
    reason: "Critical join-groups pagination reached Ready for integration unassigned; RSH-4260 closed as duplicate.",
    mitigation: "Owner is still empty. Confirm it actually lands in 26.3.0.00 rather than carrying to 2617.",
    assessment: "Closing the duplicate without landing pagination leaves the UX defect open.",
    references: [
      { label: "RSH-3763", href: jira("RSH-3763") },
      { label: "RSH-4260 (closed duplicate)", href: jira("RSH-4260") },
    ],
  },
  "RSH-3042": {
    level: "amber",
    reason: "Entity-scoping spike is Closed. The remaining work is a migration plan, not another spike.",
    mitigation: "Turn the spike output into the plan Principal User Make Work (RSH-4255) actually runs.",
    assessment: "VAS effectivePermissions already assumes entity scoping.",
    references: [
      { label: "RSH-3042", href: jira("RSH-3042") },
      { label: "RSH-1846", href: jira("RSH-1846") },
    ],
  },
  "RSH-2453": {
    level: "amber",
    reason: "Dev-cluster IAM rollout has spilled across sprints.",
    mitigation: "Still In Quality Review under Pawel Skrzypczynski and now spilling into 2618. Close it this sprint.",
    assessment: "Vizor, Analytics, and Rconnect all need this path proven.",
    references: [{ label: "RSH-2453", href: jira("RSH-2453") }],
  },
  "RSH-3503": {
    level: "amber",
    reason: "Permission-version migration spike is Closed with RSH-3042.",
    mitigation: "Pair the two spike outputs into one migration plan before RSH-4255 starts.",
    assessment: "Companion spike to entity scoping — both Closed, neither converted into a plan.",
    references: [{ label: "RSH-3503", href: jira("RSH-3503") }],
  },
  "RSH-3481": {
    level: "amber",
    reason: "Group-id OR-path spilled from 2615; scoped-group permission model is incomplete without it.",
    mitigation: "Ready for integration and unassigned. Left 2616; confirm the grant-path removal actually ships rather than rotting in the integration queue.",
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
    "Shared authentication and authorization for Regnology solutions. Privilege escalation, entity-scoping spikes, Principal User, and mirroring are Closed in Jira; whether products actually retire local user management still hangs on RSH-4255 Make Work and MDM inheritance.",
  initiativeKey: "RSH-96",
  ticketBaseUrl: JIRA,
  boardUrl: BOARD,
  snapshot: SNAPSHOT,
  sources:
    'Jira: project = RSH AND summary ~ "[IAM]", excluding Xray Test and Test Execution issues · sprint in openSprints() on board 2936. Counts come from the sync, not from this line. Confluence: IAM Integration (v17), Vizor Authentication and Authorization (v62), What IAM Service Offers (v6).',
  populated: true,
  sprint: {
    name: "Regnology Supervision Hub Platform 2618",
    start: sprint.start,
    end: sprint.end,
    committed: sprint.committed,
    done: sprint.done,
    inProgress: sprint.inProgress,
    blocked: sprint.blocked,
    narrative: `Active ${sprint.start} – ${sprint.end} on Regnology Supervision Hub board 2936. Snapshot ${SNAPSHOT}.`,
    headline:
      "Eleven items on 2618. Privilege escalation, both entity-scoping spikes, Principal User and mirroring Closed since the last snapshot — this sprint is PAT, translations, Keycloak Helm, a pagination bug, and the same two chronic spill-overs: dev-cluster IAM still in Quality Review and RSH-2169 still blocked. Six of eleven items are already Ready.",
  },
  tickets: sprintTickets.map(withRisk),
  previousSprint: {
    name: "Regnology Supervision Hub Platform 2617",
    dates: "27 Aug – 10 Sep 2026",
    narrative:
      "2617 is the sprint where the 2616 integration queue actually closed: privilege escalation, both entity-scoping spikes, the Principal User epic and permission mirroring. Unscoped module permissions and the module permission manager role cleared development and were not pulled into 2618. Dev-cluster IAM, PAT and the blocked inheritance ticket carried forward.",
    cards: [
      {
        title: "Closed around 2617",
        body: "Privilege escalation (RSH-4220), entity-scoping spikes (RSH-3042, RSH-3503), Principal User (RSH-1846) and permission mirroring (RSH-2150).",
      },
      {
        title: "Carried into 2618",
        body: "Dev-cluster IAM still in Quality Review, entity-group inheritance still blocked, PAT (RSH-4784 / RSH-4211), OpenSSL finally on the board, and the MDM All-group spike now in PO review.",
      },
      {
        title: "Left 2617 without landing in 2618",
        body: "Unscoped module permissions (RSH-4214), the module permission manager role (RSH-4215), and the CI pipeline fix (RSH-5675) — all Ready for integration, all unassigned.",
      },
    ],
    closed: previousSprintClosed,
    leftover: leftoverFrom2617,
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
    architecture,
    implementation,
    deployment,
    roadmap,
  },
  backlogGantt: {
    intro:
      "Bars are derived from Phase 1 closed epics, Phase 2 children of RSH-903, current sprint spikes, and unscheduled New items. Dates are planning horizons, not Jira due dates (those fields are empty on these epics).",
    items: backlogGantt,
    caption:
      "Source: RSH-96 / RSH-903 children · RSH board 2936 · snapshot 11 Sep 2026. Today sits in Q3 2026.",
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
      "Source: RSH-96 issue links · REG-49745 / REG-48802 / RFS-1688 · Confluence IAM Integration v17. Snapshot 11 Sep 2026.",
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
        mitigation: "Treat RSH-4254 as the 26.4 working-state epic (retitled from 26.3); keep RSH-96 as the strategy parent.",
        assessment: "RSH-96 RAG Amber (Jan 2026) for scope creep vs original plan. Stabilization slipped a release.",
        references: [
          { label: "RSH-96", href: jira("RSH-96") },
          { label: "RSH-4254", href: jira("RSH-4254") },
        ],
      },
    };
    return { ...b, risk: ticketRisk ?? extra[b.ticket] };
  }),
  next90days:
    "Privilege escalation, entity scoping, Principal User and mirroring are Closed. The next 90 days are verify-those-closures-in-a-release, close OpenSSL and dev-cluster IAM, convert the scoping spikes into a migration plan, and only then staff PAT and translations. Treat Principal User Make Work (RSH-4255) as the milestone that lets Vizor and Regulator 3 turn local user management off.",
  projectSummary: {
    jiraUrl: "https://regnology-cloud.atlassian.net/jira/software/c/projects/RSH/summary",
    done: 391,
    open: 157,
    highPriorityOpen: 26,
    unassignedOpen: 127,
    epics: 45,
    currentRelease: {
      name: "R1.3.0.01_RSH_10.02.26",
      date: "10 Feb 2026",
      released: false,
    },
    lastRelease: {
      name: "26.3.0.00_RSH-PL_27.08.26",
      date: "27 Aug 2026",
    },
    narrative:
      "Identity and Access Management sits on the Regnology Supervision Hub (RSH) board. Phase 1 shipped. Initiative RSH-96 is Amber for scope creep. Platform release 26.3.0.00 is the last released train (27 Aug). Sprint 2618 is an eleven-item mixed commitment. Counts use Jira JQL project = RSH AND summary ~ \"[IAM]\", excluding Xray Test and Test Execution issues.",
  },
  pmFocus: {
    thisSprint: [
      "Close OpenSSL RSH-2451 — it is finally on the board after three idle sprints.",
      "Close dev-cluster IAM RSH-2453 from Quality Review. It has now spilled into a sixth platform sprint.",
      "Watch RSH-5442 (MDM All-group) in PO review — it is the only movement on the dependency that has RSH-2169 blocked.",
      "Confirm privilege escalation RSH-4220 and the two scoping spikes are in a released build, not only Closed in Jira.",
      "Do not let PAT (RSH-4784 / RSH-4211) and translations (RSH-786 / RSH-6560) crowd out that verification. Phase 3 started while RSH-4255 is still New.",
      "Unscoped module permissions and the permission-manager role left 2617 at Ready for integration, unassigned. Name an owner or stop calling them current.",
    ],
    sequence: [
      {
        order: 1,
        item: "Verify privilege-escalation in a released build",
        ticket: "RSH-4220",
        why: "Closed in Jira, unassigned. Delegated admin is not unblocked until a customer build has the fix.",
      },
      {
        order: 2,
        item: "OpenSSL application security",
        ticket: "RSH-2451",
        why: "On the 2618 board at Ready. Cheap to close this sprint.",
      },
      {
        order: 3,
        item: "Dev-cluster IAM rollout",
        ticket: "RSH-2453",
        why: "Still In Quality Review. Every consumer integration waits on this path being proven.",
      },
      {
        order: 4,
        item: "Turn scoping spikes into a migration plan",
        ticket: "RSH-3042",
        why: "RSH-3042 and RSH-3503 are Closed. RSH-4255 cannot start without the plan they were meant to produce.",
      },
      {
        order: 5,
        item: "Principal User — Make Work",
        ticket: "RSH-4255",
        why: "Still New. This is the kill-switch for Vizor and Regulator 3 local user management, not the Closed RSH-1846 epic.",
      },
    ],
    questions: [
      "Will Master Data Management (MDM) unblock entity-group membership in 26.4, or do we defer inheritance in writing?",
      "What is the acceptance criteria for Principal User Make Work so Vizor can turn Security.Login.Type = IAM?",
      "Is audience validation still a go-live gate for the next customer environment?",
      "Should PAT and translations stay behind 26.4 stabilization, given they are already on the 2618 board?",
    ],
  },
};
