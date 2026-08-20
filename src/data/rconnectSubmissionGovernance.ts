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
    level: "red",
    reason:
      "TEST and PROD submissions are told apart only by one segment of the FiTax exchange file name.",
    mitigation:
      "Land the backend and the NiFi half together (RCON-1381), and fail the submission when the segment is missing or invalid rather than defaulting.",
    assessment:
      "RICE 12.2 — the highest score on the board. A test file accepted by a live tax authority is a regulatory incident, and the credentials endpoint has to learn the environment parameter at the same time.",
    references: [
      { label: "RCON-1366", href: jira("RCON-1366") },
      { label: "RCON-1381 (NiFi half)", href: jira("RCON-1381") },
    ],
  },
  "RCON-1381": {
    level: "red",
    reason: "The flow half of TEST/PROD routing. If it ships apart from RCON-1366 the two disagree.",
    mitigation: "Treat the pair as one deliverable; neither is done alone.",
    references: [{ label: "RCON-1381", href: jira("RCON-1381") }],
  },
  "RCON-1221": {
    level: "amber",
    reason:
      "The regression suite that should protect the monolith merge is being built in the same sprint as the merge.",
    mitigation:
      "Finish the suite and the pipeline (RCON-1248) before declaring RCON-931 complete, not after.",
    assessment:
      "RICE 6.4. ADR-0001 lists broad regression, integration and performance testing as the main migration risk, and sets 80% coverage as a success criterion.",
    references: [
      { label: "RCON-1221", href: jira("RCON-1221") },
      { label: "RCON-931 merge", href: jira("RCON-931") },
    ],
  },
  "RCON-1306": {
    level: "amber",
    reason: "The only carry-over from sprint 13, and it has spent both sprints in Product Owner review.",
    mitigation:
      "Get a decision in this sprint. It is the visible half of the schema-driven feedback change.",
    assessment: "Review is where this item stalls, not implementation.",
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
    reason: "Unassigned dependency upgrade, still New two days before the sprint closes.",
    mitigation: "Move it to the next sprint rather than carrying an unowned item.",
    references: [{ label: "RCON-1390", href: jira("RCON-1390") }],
  },
  "RCON-1382": {
    level: "amber",
    reason:
      "The NiFi half of the error-reason work is still New while the backend half is in implementation.",
    mitigation: "Sequence with RCON-902; a reason the flow never sends cannot be displayed.",
    references: [
      { label: "RCON-1382", href: jira("RCON-1382") },
      { label: "RCON-902", href: jira("RCON-902") },
    ],
  },
  "RCON-902": {
    level: "amber",
    reason: "Carry-over. Until it lands, every NiFi failure looks identical to a supervisor.",
    mitigation: "Land with RCON-1382 so the reason exists end to end.",
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
    "Jira: project = RCON, less the RCON-276 Communicator subtree and Xray test artefacts (806 resolved, 67 open, 45 epics) · board 3734, sprint RCON.S sprint 14. Confluence RCON space: Rconnect Submission product page (v2, Feb 2026), seven architecture decision records, the Rconnect and NiFi integration guides, Deploy as a component on PROD, and the security vulnerability triage (Aug 2026).",
  populated: true,
  sprint: {
    name: sprint.name,
    start: sprint.start,
    end: sprint.end,
    committed: sprint.committed,
    done: sprint.done,
    inProgress: sprint.inProgress,
    blocked: sprint.blocked,
    narrative: `Active ${sprint.start} – ${sprint.end} on Rconnect board 3734, one of five concurrent team sprints there. Goal: ${sprint.goal}. Fifteen items committed. Snapshot ${SNAPSHOT}.`,
    headline:
      "Nothing is Closed with two days to run: nine items in implementation, two parked in Product Owner review, and four still New — two of those unassigned. Critical TEST/PROD routing (RCON-1366 with RCON-1381) is the item that must not slip.",
  },
  tickets: sprintTickets.map(withRisk),
  previousSprint: {
    name: "RCON.S sprint 13",
    dates: "closed 10 Aug 2026",
    narrative:
      "Twenty-three items. Eight reached Closed — all but one of them user-visible bug fixes in the dashboard and feedback views. Fourteen stopped at Ready for integration, which this project treats as resolved, and only one item, RCON-1306, was carried into sprint 14.",
    cards: [
      {
        title: "Closed in sprint 13",
        body: "Eight fixes: database error handling, manual feedback fetch errors, combined sorting and filtering, timezone and timestamp consistency, duplicated toasts, and backend field validation.",
      },
      {
        title: "Resolved but not released",
        body: "Fourteen items at Ready for integration, all unassigned — including the legacy credential-table removal, the critical Sonar fixes, the CVE work, and the bucket-to-bucket flow copier.",
      },
      {
        title: "Carried into sprint 14",
        body: "Only RCON-1306, the multiple-validation-error display, and it is still in Product Owner review. Clean carry-over, but it hides how much work is parked one step short of a release.",
      },
    ],
    closed: previousSprintClosed,
    leftover: readyForIntegration.map(withRisk),
  },
  overview: {
    intro:
      "Rconnect Submission orchestrates the delivery of regulatory reports to supervisory authorities. Synthesized from Jira work packages RCON-269, RCON-270, RCON-271 and RCON-872, board 3734, and the Confluence RCON space: the product page, seven architecture decision records, the Rconnect and NiFi integration guides, the production deployment guide, and the security triage.",
    callout:
      "An integrator changes no business logic to adopt Rconnect — it drops files in an agreed bucket location and Rconnect owns everything after that. Countries and integrators are live and the product is generating support tickets, so the 2026 question is not capability but cost of ownership: collapse the services, consolidate the database, generalize the code, and settle how NiFi flows are distributed. Amber because two open architecture decisions contradict each other, the regression suite is being built alongside the refactor it should protect, and a large tranche of resolved work has not been released.",
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
        reason: "Resolved is not released: 806 items read as done against 67 open.",
        mitigation:
          "Treat Ready for integration as work in progress in every report, and release the sprint-13 tranche before adding to it.",
        assessment:
          "Fourteen of sprint 13's twenty-three items sit there unassigned, including the credential-table removal and the CVE and Sonar fixes.",
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
          "Read RCON.S versions for this product; treat any project-level release date as Communicator's unless the name says otherwise.",
        assessment:
          "Jira's next unreleased version is RCON.C 1.2.0 on 26 Aug 2026, which belongs to Communicator, while Submission tracks 2.0.0, 2.1.0 and 2.2.0 in epic titles only.",
        references: [{ label: "RCON-276", href: jira("RCON-276") }],
      },
    };
    return { ...b, risk: ticketRisk ?? extra[b.ticket] };
  }),
  next90days:
    "Land TEST/PROD routing as one deliverable, finish the regression suite before declaring the monolith merge done, and pick a single flow-distribution model so RCON-1173 stops being the decision by default. Then release the Ready for integration tranche — the legacy credential tables, the Sonar and CVE fixes — before starting the 2.2.0 train. Manual-upload entity enforcement should not wait for Phase 4: it is a cross-entity submission path that is open today.",
  projectSummary: {
    jiraUrl: "https://regnology-cloud.atlassian.net/jira/software/c/projects/RCON/summary",
    done: 806,
    open: 67,
    highPriorityOpen: 10,
    unassignedOpen: 29,
    epics: 45,
    currentRelease: { name: "RCON.C 1.2.0", date: "26 Aug 2026", released: false },
    lastRelease: { name: "RCON.C 1.1.0", date: "27 Jul 2026" },
    narrative:
      "Counts are Jira project RCON with the RCON-276 Communicator subtree and Xray test artefacts removed. Read the resolved figure carefully: this project sets a resolution date at Ready for integration, so 806 covers a great deal of work that has not yet been released. The next version Jira knows about is a Communicator release — Submission's own trains are named RCON.S 2.0.0, 2.1.0 and 2.2.0 in epic titles.",
  },
  pmFocus: {
    thisSprint: [
      "Ship RCON-1366 and RCON-1381 together — a TEST file reaching a live authority is a regulatory incident, not a defect.",
      "Get RCON-1306 out of Product Owner review; it has now spent two sprints there.",
      "Assign or drop the two unassigned New items, RCON-1355 and RCON-1390, rather than carrying them.",
      "Decide whether the NiFi error-reason half (RCON-1382) is in this sprint at all; the backend half cannot show a reason the flow never sends.",
      "Say in writing which flow-distribution model RCON-1173 is building, ADR-0004 or ADR-0005.",
    ],
    sequence: [
      {
        order: 1,
        item: "TEST / PROD submission routing",
        ticket: "RCON-1366",
        why: "Critical and in flight. Wrong-environment submission is the highest-consequence failure this product has.",
      },
      {
        order: 2,
        item: "Regression suite and test pipeline",
        ticket: "RCON-1221",
        why: "ADR-0001 names regression risk as the main cost of the merge. The suite has to exist before the merge is called done.",
      },
      {
        order: 3,
        item: "Flow distribution decision",
        ticket: "RCON-1173",
        why: "Two open ADRs contradict each other. Implementation is already choosing; make the choice explicit and cheap to reverse.",
      },
      {
        order: 4,
        item: "Release the Ready for integration tranche",
        ticket: "RCON-1069",
        why: "Legacy credential tables, Sonar fixes and CVE work are resolved and unreleased. Two credential models in production is avoidable.",
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
