import {
  BOARD,
  CONFLUENCE,
  JIRA,
  SNAPSHOT,
  architecture,
  backlogGantt,
  bottlenecks,
  consumers,
  coreEpics,
  deployment,
  implementation,
  layers,
  previousSprintClosed,
  raciHeaders,
  raciRows,
  readyForIntegration,
  rice,
  roadmap,
  sprint,
  sprintTickets,
  stakeholderGantt,
  stakeholders,
} from "./rconnectSubmission";
import type { ProjectGovernance, Risk, Ticket } from "../template/types";

function jira(key: string) {
  return `${JIRA}/${key}`;
}

export const TICKET_RISKS: Record<string, Risk> = {
  "RCON-1366": {
    level: "amber",
    reason:
      "Closed in Jira. TEST and PROD submissions are told apart only by one segment of the FiTax exchange file name — confirm the backend half is in a released build.",
    mitigation:
      "Confirm RCON-1366 and RCON-1381 shipped together in RCON.S 2.2.0, and that a missing or invalid TestProd segment fails the submission rather than defaulting.",
    assessment:
      "Was RICE 12.2 — the highest score on the board. A test file accepted by a live tax authority is a regulatory incident. Closed 7 Sep 2026; the residual risk is release confirmation, not implementation.",
    references: [
      { label: "RCON-1366", href: jira("RCON-1366") },
      { label: "RCON-1381 (NiFi half)", href: jira("RCON-1381") },
    ],
  },
  "RCON-1381": {
    level: "amber",
    reason:
      "Closed in Jira. The flow half of TEST/PROD routing — confirm it released with RCON-1366 so the two agree.",
    mitigation: "Treat the pair as one released deliverable; neither is done alone.",
    references: [{ label: "RCON-1381", href: jira("RCON-1381") }],
  },
  "RCON-1221": {
    level: "amber",
    reason:
      "Closed in Jira. The regression suite that should protect the monolith merge is written; confirm it is released and actually run.",
    mitigation:
      "Finish the pipeline (RCON-1248) and run the suite on every build before declaring RCON-931 complete, not after.",
    assessment:
      "RICE 6.4. ADR-0001 lists broad regression, integration and performance testing as the main migration risk, and sets 80% coverage as a success criterion. The suite ticket is Closed; the pipeline is still in implementation.",
    references: [
      { label: "RCON-1221", href: jira("RCON-1221") },
      { label: "RCON-931 merge", href: jira("RCON-931") },
    ],
  },
  "RCON-1306": {
    level: "amber",
    reason:
      "Closed in Jira after a two-sprint Product Owner review stall. Confirm the validation-error display is in a released build.",
    mitigation:
      "Treat Closed as confirm-released, not banked. It is the visible half of the schema-driven feedback change.",
    assessment: "Review was where this item stalled, not implementation. Closed after sprints 13 and 14.",
    references: [{ label: "RCON-1306", href: jira("RCON-1306") }],
  },
  "RCON-1173": {
    level: "amber",
    reason:
      "Being implemented while ADR-0004 and ADR-0005 still disagree on whether NiFi Registry survives at all.",
    mitigation:
      "Pick one distribution model in writing before this instance becomes the de facto answer.",
    assessment:
      "ADR-0005 was confirmed with the rcloud team and rules out runtime Git access from tenant workloads, which is the mechanism ADR-0004 depends on.",
    references: [
      { label: "RCON-1173", href: jira("RCON-1173") },
      { label: "Architecture decision records", href: CONFLUENCE.adrs },
    ],
  },
  "RCON-1355": {
    level: "amber",
    reason: "Unassigned bug on the resubmit path inside a committed sprint.",
    mitigation:
      "Assign it or drop it from the sprint. It shares the messageRefId problem with the manual-upload retry work.",
    references: [
      { label: "RCON-1355", href: jira("RCON-1355") },
      { label: "RCON-1409", href: jira("RCON-1409") },
    ],
  },
  "RCON-1390": {
    level: "amber",
    reason: "one-ui 6.0.1 upgrade is Implemented and still sitting in front of a release.",
    mitigation: "Include it in the next Submission release rather than carrying Implemented work again.",
    references: [{ label: "RCON-1390", href: jira("RCON-1390") }],
  },
  "RCON-1382": {
    level: "amber",
    reason:
      "The NiFi half of the error-reason work is still in implementation after the backend half Closed.",
    mitigation: "Land it so a reason RCON-902 can store is actually sent by the flow.",
    references: [
      { label: "RCON-1382", href: jira("RCON-1382") },
      { label: "RCON-902", href: jira("RCON-902") },
    ],
  },
  "RCON-902": {
    level: "amber",
    reason: "Closed in Jira. Until the NiFi half lands, every NiFi failure still looks identical to a supervisor.",
    mitigation: "Confirm the backend half is released, and land RCON-1382 so the reason exists end to end.",
    references: [{ label: "RCON-902", href: jira("RCON-902") }],
  },
  "RCON-1069": {
    level: "amber",
    reason:
      "Two credential models are in production until the legacy per-country tables are dropped.",
    mitigation: "Release it — the work is already resolved and only waiting on a release.",
    assessment:
      "Completes ADR-0002. cesop_credentials_de, _hu and _mt only disappear when this ships.",
    references: [{ label: "RCON-1069", href: jira("RCON-1069") }],
  },
  "RCON-1409": {
    level: "red",
    reason:
      "Manual upload validates the file name against the case's country and period but never its entity, so a file for another entity in the same country is submitted as that entity.",
    mitigation:
      "Hard reject on entity mismatch, enforce Writer on the upload endpoint rather than by hiding the button, and stop the success message claiming the report reached the authority.",
    assessment:
      "RICE 9.5. The refinement analysis is already attached to the ticket; it is New and unassigned.",
    references: [
      { label: "RCON-1409", href: jira("RCON-1409") },
      { label: "RCON-476 original AC", href: jira("RCON-476") },
    ],
  },
};

function withRisk(ticket: Ticket): Ticket {
  const risk = TICKET_RISKS[ticket.key];
  return risk ? { ...ticket, risk } : ticket;
}

export const rconnectSubmissionGovernance: ProjectGovernance = {
  slug: "rconnect-submission",
  name: "RCONNECT SUBMISSION",
  fullName: "Rconnect Submission",
  rag: "Amber",
  platform: "Rcloud / GKE",
  summary:
    "Orchestrates report delivery to supervisory authorities over Apache NiFi. Countries and integrators are live; the CORE refactor, the flow-distribution decision, and a large resolved-but-unreleased backlog decide whether it scales.",
  initiativeKey: "RCON-872",
  ticketBaseUrl: JIRA,
  boardUrl: BOARD,
  snapshot: SNAPSHOT,
  sources:
    "Jira: project = RCON, less the RCON-276 Communicator subtree and Xray test artefacts (834 resolved, 79 open, 51 epics) · board 3734, sprint RCON.S sprint 16. Confluence RCON space: Rconnect Submission product page (v2, Feb 2026), seven architecture decision records, the Rconnect and NiFi integration guides, Deploy as a component on PROD, and the security vulnerability triage (Aug 2026).",
  populated: true,
  sprint: {
    name: sprint.name,
    start: sprint.start,
    end: sprint.end,
    committed: sprint.committed,
    done: sprint.done,
    inProgress: sprint.inProgress,
    blocked: sprint.blocked,
    narrative: `Active ${sprint.start} – ${sprint.end} on Rconnect board 3734, one of five concurrent team sprints there. Goal: ${sprint.goal}. Twenty-six items committed. Snapshot ${SNAPSHOT}.`,
    headline:
      "One Closed (Sweden CESOP feedback). ActiveMQ JMS on NiFi (RCON-1540) joined mid-sprint. A large New pile is still unassigned. The messaging-bus pair sits at Ready for integration.",
  },
  tickets: sprintTickets.map(withRisk),
  previousSprint: {
    name: "RCON.S sprint 15",
    dates: "closed 7 Sep 2026",
    narrative:
      "Sprint 15 sat between 14 and 16 and closed with RCON.S 2.2.0. Release activities, Hungary flow, feedback-in-the-same-view, and the Alexandru enablers booking reached Closed, as did the former red risks — TEST/PROD routing, the regression suite, and the two-sprint validation-error stall. A long spillover list moved into sprint 16.",
    cards: [
      {
        title: "Closed in sprint 15",
        body: "Release activities (RCON-1425), display feedback with submissions (RCON-1424), Hungary flow (RCON-1460), and Alexandru enablers support (RCON-1420). TEST/PROD routing (RCON-1366 / RCON-1381), the regression suite (RCON-1221), and validation-error display (RCON-1306) also Closed.",
      },
      {
        title: "RCON.S 2.2.0 shipped",
        body: "Submission now has its own last release — RCON.S 2.2.0 on 7 Sep 2026. Jira's currentRelease is still Communicator's RCON.C 1.2.0 (2 Sep, unreleased).",
      },
      {
        title: "Carried into sprint 16",
        body: "NiFi registry updater (RCON-1173, RCON-1134), test-automation pipeline (RCON-1248), report-frequency spike (RCON-1236), resubmit bug (RCON-1355), pipeline tag override (RCON-1334), one-ui upgrade (RCON-1390), NiFi error reason (RCON-1382), and the messaging-bus pair (RCON-1410, RCON-1411).",
      },
    ],
    closed: previousSprintClosed,
    leftover: readyForIntegration.map(withRisk),
  },
  overview: {
    intro:
      "Rconnect Submission orchestrates the delivery of regulatory reports to supervisory authorities. Synthesized from Jira work packages RCON-269, RCON-270, RCON-271 and RCON-872, board 3734, and the Confluence RCON space: the product page, seven architecture decision records, the Rconnect and NiFi integration guides, the production deployment guide, and the security triage.",
    callout:
      "An integrator changes no business logic to adopt Rconnect — it drops files in an agreed bucket location and Rconnect owns everything after that. Countries and integrators are live and the product is generating support tickets, so the 2026 question is not capability but cost of ownership: collapse the services, consolidate the database, generalize the code, and settle how NiFi flows are distributed. Amber because two open architecture decisions contradict each other, the NiFi registry updater is still in flight against an unsettled ADR, and a large tranche of resolved work has not been released.",
    vision: [
      "Take report delivery out of every product that files to a regulator. External applications drop files in predefined locations, Apache NiFi executes the delivery, and Rconnect tracks state so a supervisor can see where a report actually is.",
      "Adding a country should be configuration, not a release: a regime declares its credential schema and its feedback schema, and the country flow maps the authority's answer onto them. That is what the Phase II generalization and the schema-driven feedback work are for.",
      "Owner: Anca Dobrea. Tech lead: Kamil Burek. Portfolio: RCON-269 Rconnect → RCON-270 Rconnect Submission Flow. NiFi flow development sits with external contractors.",
    ],
    contract: [
      "Write the report into the agreed bucket Outbox. The exchange file name carries the routing facts — transmitter, country, regime, TEST or PROD, database id, reporting year, delivery reference, and the payload file name the authority requires. Contents are never opened.",
      "Rconnect moves the file to Processed on success and to an errors location on failure, and a trigger file in Feedback Request drives retrieval. Backend APIs need an Okta bearer token; the NiFi adaptor is for NiFi only and integrators configure nothing against it.",
      "Explicitly not supported: the production backend API is customer specific and not published for general use, and Parameter Context values are not visible inside custom JAR or script processors — each value must be redeclared as a processor property.",
    ],
    layers,
    consumers,
    epics: coreEpics,
    architecture,
    implementation,
    deployment,
    roadmap,
  },
  backlogGantt: {
    intro:
      "Bars come from the RCON-872 portfolio epics, the enabler work packages, and the release containers named in epic titles. Dates are planning horizons drawn from ADR dates, epic creation, and release windows — Jira due dates are empty on this work, so these are not commitments.",
    caption: `Source: RCON-271 / RCON-872 children · board 3734 · snapshot ${SNAPSHOT}. The flow-distribution bar is marked blocked because the decision behind it is still open.`,
    items: backlogGantt,
  },
  stakeholderGantt: {
    intro:
      "Integration roadmap for the products and clients that file through Rconnect. Read this with integrators and platform, not with the engineering backlog: the dates that matter here are onboarding and release windows, not epic completion.",
    highlights: [
      {
        title: "Shipped value",
        body: "FiTax CESOP, Polish tON, and the IRS route are closed and in production. RRH / Abacus 360 and Softserve S9 are live enough to be raising support tickets.",
      },
      {
        title: "2026 forcing function",
        body: "PwC feedback drives the entity permission model and TEST/PROD routing. RTH is the first integrator taking Rconnect as an independent component rather than a subchart of its own chart.",
      },
      {
        title: "Blocked on a decision, not effort",
        body: "Standalone releases and shared-IAM identity both wait on decisions that are written down but not settled — ADR-0006 consequences are recorded as to-be-determined, and ADR-0003 has not chosen a Keycloak topology.",
      },
    ],
    items: stakeholderGantt,
    caption: `Source: RCON-271 enablers, integrator support tickets, and the Rconnect integration guide · snapshot ${SNAPSHOT}.`,
  },
  stakeholders,
  raci: { headers: raciHeaders, rows: raciRows },
  rice,
  bottlenecks: bottlenecks.map((b) => {
    const ticketRisk = b.ticket.startsWith("RCON-") ? TICKET_RISKS[b.ticket] : undefined;
    const extra: Record<string, Risk> = {
      "RCON-1210": {
        level: "amber",
        reason: "Resolved is not released: 834 items read as done against 79 open.",
        mitigation:
          "Treat Ready for integration as work in progress in every report, and release the leftover tranche plus the sprint-16 messaging-bus pair before adding to it.",
        assessment:
          "The credential-table removal and the CVE and Sonar fixes are still parked there, and RCON-1410 / RCON-1411 joined them from sprint 16.",
        references: [
          { label: "RCON-1210", href: jira("RCON-1210") },
          { label: "RCON-898", href: jira("RCON-898") },
        ],
      },
      "NiFi integration guide": {
        level: "amber",
        reason:
          "Retries do not distinguish recoverable from non-recoverable failures, and reuse is copy-paste.",
        mitigation:
          "Parameterise the penalty duration, keep the retry window inside the three-hour entity-tracking window, and check the parameter context on every copied process group.",
        assessment:
          "Both behaviours are documented as intended in the NiFi integration guide, with manual vigilance as the only mitigation offered.",
        references: [{ label: "NiFi integration guide", href: CONFLUENCE.nifi }],
      },
      "RCON-1112": {
        level: "red",
        reason: "Three Critical CVEs triaged as real in shipped images.",
        mitigation:
          "Rebuild rconnect-ui, the NiFi images, and ZooKeeper against patched bases; record the unpatchable PostgreSQL image as an accepted risk with an owner.",
        assessment:
          "nginx ALPINE-CVE-2026-42945, libssh2 CVE-2026-55200, and jetty-http CVE-2026-2332 are the three the team itself marks as real issues rather than false positives.",
        references: [
          { label: "Security vulnerabilities", href: CONFLUENCE.security },
          { label: "RCON-1112", href: jira("RCON-1112") },
        ],
      },
      "RCON-276": {
        level: "amber",
        reason: "One Jira project holds two products, and the version scheme mixes them.",
        mitigation:
          "Read RCON.S versions for this product; treat any project-level currentRelease as Communicator's unless the name says otherwise.",
        assessment:
          "Submission last released RCON.S 2.2.0 on 7 Sep 2026. Jira's currentRelease is still RCON.C 1.2.0 on 2 Sep 2026 — Communicator's, and still unreleased.",
        references: [{ label: "RCON-276", href: jira("RCON-276") }],
      },
    };
    return { ...b, risk: ticketRisk ?? extra[b.ticket] };
  }),
  next90days:
    "TEST/PROD routing is Closed — confirm it shipped in RCON.S 2.2.0. Settle the flow-distribution decision so RCON-1173 / RCON-1134 stop being the answer by default, release the Ready for integration tranche (messaging-bus 1410/1411, legacy credential tables, Sonar and CVE fixes), and land Spring Boot 4 (RCON-1490). Manual-upload entity enforcement should not wait for Phase 4: it is a cross-entity submission path that is open today.",
  projectSummary: {
    jiraUrl: "https://regnology-cloud.atlassian.net/jira/software/c/projects/RCON/summary",
    done: 834,
    open: 79,
    highPriorityOpen: 12,
    unassignedOpen: 40,
    epics: 51,
    currentRelease: { name: "RCON.C 1.2.0", date: "2 Sept 2026", released: false },
    lastRelease: { name: "RCON.S 2.2.0", date: "7 Sept 2026" },
    narrative:
      "Counts are Jira project RCON with the RCON-276 Communicator subtree and Xray test artefacts removed. Read the resolved figure carefully: this project sets a resolution date at Ready for integration, so 834 covers a great deal of work that has not yet been released. Submission last released RCON.S 2.2.0 on 7 Sep 2026. Jira's currentRelease is still Communicator's RCON.C 1.2.0 (2 Sep, unreleased).",
  },
  pmFocus: {
    thisSprint: [
      "Land RCON-1173 and RCON-1134 — the NiFi registry updater instance and the integration that makes it real.",
      "Close the messaging-bus pair at Ready for integration, RCON-1410 and RCON-1411, into a release.",
      "Assign the unassigned New pile: RCON-1355, RCON-1481, RCON-1236, RCON-1453, RCON-1486, RCON-1523, RCON-1526, RCON-1527.",
      "Keep RCON-1490 moving — Spring Boot 4.1.1 on rconnect-backend.",
      "Stand up the FiTax test environment (RCON-1523) so the next integration release has somewhere to land.",
    ],
    sequence: [
      {
        order: 1,
        item: "NiFi registry updater",
        ticket: "RCON-1173",
        why: "In implementation against an unsettled ADR. RCON-1134 has to land with it or the instance is unused.",
      },
      {
        order: 2,
        item: "Messaging-bus pair",
        ticket: "RCON-1410",
        why: "Both halves are Ready for integration. Close them into a release rather than carrying RFI another sprint.",
      },
      {
        order: 3,
        item: "Assign the unassigned New pile",
        ticket: "RCON-1355",
        why: "Resubmit, report frequency, regime filter, NiFi error display, FiTax test env, and schema-driven feedback are committed and ownerless.",
      },
      {
        order: 4,
        item: "Spring Boot 4 on rconnect-backend",
        ticket: "RCON-1490",
        why: "Already in implementation. A platform upgrade in the same sprint as a large New pile needs an owner who is not also firefighting unassigned work.",
      },
      {
        order: 5,
        item: "Manual upload entity enforcement",
        ticket: "RCON-1409",
        why: "A cross-entity submission path is open today, and the refinement analysis is already attached to the ticket.",
      },
    ],
    questions: [
      "ADR-0004 removes NiFi Registry; ADR-0005 builds inside it. Which one is the target, and who owns closing the other?",
      "Is Ready for integration a delivery state or a queue? If it is a queue, what is the release cadence that drains it?",
      "Does the monolith merge wait for the regression suite, or do we accept the merge without it and say so?",
      "Which Keycloak option does ADR-0003 take, and does RCON-928 wait for the shared platform's Principal User work?",
      "Who accepts the risk on the PostgreSQL image the team states it cannot patch?",
    ],
  },
};
