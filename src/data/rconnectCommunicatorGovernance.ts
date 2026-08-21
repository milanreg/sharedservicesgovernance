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
  epics,
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
} from "./rconnectCommunicator";
import type { ProjectGovernance, Risk, Ticket } from "../template/types";

function jira(key: string) {
  return `${JIRA}/${key}`;
}

export const TICKET_RISKS: Record<string, Risk> = {
  "RCON-1290": {
    level: "red",
    reason:
      "A database password and a Gemini API key are committed to git in the dev Helm values file.",
    mitigation:
      "Inject both from Jenkins credentials at deploy time, then rotate them — a committed credential stays in history after it is removed from the file.",
    assessment:
      "RICE 24.3, the highest score on this board, and it is unassigned at Ready for integration. The ticket title says Google Secret Manager while its body and acceptance criteria say Jenkins credentials; that contradiction is unresolved.",
    references: [{ label: "RCON-1290", href: jira("RCON-1290") }],
  },
  "RCON-1300": {
    level: "red",
    reason:
      "On the industry-side UI, pressing F5 on case details after login fails with an IAM redirect URI error.",
    mitigation:
      "Root-cause it before the external-UI-only mode reaches a customer. Reproduced on both dev and Marley, so it is the chart or the app, not one environment's IAM configuration.",
    assessment:
      "RICE 8.4. The internal UI is unaffected, which is why this can ship unnoticed: it only breaks the half of the product the regulated firms use.",
    references: [
      { label: "RCON-1300", href: jira("RCON-1300") },
      { label: "RCON-1303 external UI mode", href: jira("RCON-1303") },
    ],
  },
  "RCON-1383": {
    level: "amber",
    reason:
      "External Keycloak client setup reads the internal client names from configuration.",
    mitigation:
      "Read each side's own client names. Every deployment so far happened to use identical names for both, which is allowed but not required.",
    assessment:
      "RICE 18.9. It works today by coincidence. The first customer that names its external client differently gets a broken login.",
    references: [{ label: "RCON-1383", href: jira("RCON-1383") }],
  },
  "RCON-1351": {
    level: "amber",
    reason:
      "A rolling update can leave the new pod with an empty entities list, because the old pod consumed the registration confirmation it was waiting for.",
    mitigation:
      "Poll the IAM module list instead of waiting on a confirmation event, and retire the old path rather than keeping both.",
    assessment:
      "RICE 8.4. To a supervisor an empty entity list looks like missing data, not like a deployment artefact.",
    references: [{ label: "RCON-1351", href: jira("RCON-1351") }],
  },
  "RCON-1288": {
    level: "amber",
    reason:
      "Marley staging has no SMTP configuration at all, so the email half of notifications cannot be exercised before a customer sees it.",
    mitigation:
      "Configure host, port, auth, sender and the internal and external app URLs, with credentials in a Kubernetes secret rather than a ConfigMap.",
    references: [
      { label: "RCON-1288", href: jira("RCON-1288") },
      { label: "RCON-920 notifications", href: jira("RCON-920") },
    ],
  },
  "RCON-1380": {
    level: "amber",
    reason:
      "The release is a sprint ticket dated the sprint end date, with the end-to-end suite broken and no performance baseline.",
    mitigation:
      "Fix RCON-1400 first and decide explicitly whether 1.2.0 ships without performance tests, rather than discovering it on the day.",
    references: [
      { label: "RCON-1380", href: jira("RCON-1380") },
      { label: "RCON-1400 e2e", href: jira("RCON-1400") },
      { label: "RCON-1373 performance tests", href: jira("RCON-1373") },
    ],
  },
  "RCON-1400": {
    level: "amber",
    reason:
      "The end-to-end suite is red after platform changes, and the fix has now crossed two sprints in Product Owner review.",
    mitigation: "Land it before the release, not alongside it.",
    references: [{ label: "RCON-1400", href: jira("RCON-1400") }],
  },
  "RCON-1293": {
    level: "red",
    reason:
      "The architecture review for a live AI feature is unassigned, and the standards-alignment epic behind it is New and Low priority.",
    mitigation:
      "Give the review an owner and a date. Documenting the mechanism and checking it against the MCP guidelines is the cheap half; the alignment epic is the expensive half.",
    assessment:
      "RICE 10.8 across RCON-1371. The thread summary suggests replies and advises whether a thread can be closed, and it is already in product as an experimental proof of concept.",
    references: [
      { label: "RCON-1293", href: jira("RCON-1293") },
      { label: "RCON-1371 standards alignment", href: jira("RCON-1371") },
      { label: "RCON-1113 the PoC", href: jira("RCON-1113") },
    ],
  },
  "RCON-1213": {
    level: "amber",
    reason:
      "Case and thread change history is being persisted against a schema its own author marks provisional, and the UI mockup for it is unassigned.",
    mitigation:
      "Settle the schema before the first migration ships; history is the one table you cannot rewrite after the fact.",
    references: [
      { label: "RCON-1213", href: jira("RCON-1213") },
      { label: "RCON-1397 history UI mockup", href: jira("RCON-1397") },
    ],
  },
  "RCON-1352": {
    level: "amber",
    reason:
      "Valkey is in the chart but unused; entities and other cacheable data still live in per-pod process memory.",
    mitigation:
      "Inventory each cache with an explicit keep-or-move decision, migrate entities first, and update the Valkey resources in the sizing templates.",
    references: [{ label: "RCON-1352", href: jira("RCON-1352") }],
  },
  "RCON-1312": {
    level: "amber",
    reason:
      "Several instances launching together against a brand-new database can crash one on startup.",
    mitigation:
      "A restart clears it, but the ticket itself notes it could look like a real incident on a first install.",
    references: [{ label: "RCON-1312", href: jira("RCON-1312") }],
  },
  "RCON-1297": {
    level: "amber",
    reason:
      "The reporting entity dropdown can show another module's entities while a case is being created.",
    mitigation:
      "Land it with the two related stale-state defects, RCON-1307 and RCON-1308; they share the same cause.",
    assessment:
      "Cross-module entity leakage at the moment of case creation is a confidentiality concern, not only a UI defect.",
    references: [
      { label: "RCON-1297", href: jira("RCON-1297") },
      { label: "RCON-1308", href: jira("RCON-1308") },
    ],
  },
  "RCON-1344": {
    level: "amber",
    reason:
      "Dev is pinned to RSH platform 26.2.0 and the upgrade verification is unassigned.",
    mitigation:
      "Re-verify the whole identity path on upgrade — module registration, Keycloak auth, the IAM API, and platform messaging.",
    references: [{ label: "RCON-1344", href: jira("RCON-1344") }],
  },
  "RCON-1359": {
    level: "amber",
    reason:
      "Delivered by an automated agent account under the RForge label rather than by a named engineer.",
    mitigation:
      "Worth a policy, not a fix: decide who reviews and accepts agent-authored changes to the registration path.",
    references: [{ label: "RCON-1359", href: jira("RCON-1359") }],
  },
  "RCON-1373": {
    level: "amber",
    reason: "No performance baseline exists, and the ticket is New and unassigned in the release sprint.",
    mitigation: "Either staff it or state that 1.2.0 ships without a performance baseline.",
    references: [{ label: "RCON-1373", href: jira("RCON-1373") }],
  },
  "RCON-972": {
    level: "amber",
    reason:
      "The dashboard table still filters, sorts and pages client-side, and the backend support is unassigned.",
    mitigation:
      "Size it against real case volumes before go-live rather than after the first large customer.",
    references: [{ label: "RCON-972", href: jira("RCON-972") }],
  },
};

function withRisk(ticket: Ticket): Ticket {
  const risk = TICKET_RISKS[ticket.key];
  return risk ? { ...ticket, risk } : ticket;
}

export const rconnectCommunicatorGovernance: ProjectGovernance = {
  slug: "rconnect-communicator",
  name: "RCONNECT COMMUNICATOR",
  fullName: "Rconnect Communicator",
  rag: "Amber",
  platform: "Regnology Supervision Hub / GKE",
  summary:
    "Structured supervisory correspondence — cases and threads between a regulator and the firms it supervises. Phase 1 and Phase 2 are functionally complete; identity integration, deployment modes, and an AI feature that shipped ahead of its governance decide whether it is ready for customers.",
  initiativeKey: "RCON-276",
  ticketBaseUrl: JIRA,
  boardUrl: BOARD,
  snapshot: SNAPSHOT,
  sources:
    "Jira: the RCON-276 subtree of project RCON, less Xray test artefacts (243 resolved, 58 open, 28 epics) · board 3734, sprint Yolo - Communicator Sprint 21, and sprint 20 for spillover. Epic and story descriptions carry the detail: RCON-920 for the notification contract, RCON-922 for the internal-thread status decision, RCON-1303 and RCON-1304 for the chart modes, RCON-1357 and RCON-1351 for module registration. Confluence RCON Phase 2 RSH is the linked specification; the Confluence Data Center endpoint was unreachable at snapshot time, so no page versions are recorded.",
  populated: true,
  sprint: {
    name: sprint.name,
    start: sprint.start,
    end: sprint.end,
    committed: sprint.committed,
    done: sprint.done,
    inProgress: sprint.inProgress,
    blocked: sprint.blocked,
    narrative: `Active ${sprint.start} – ${sprint.end} on Rconnect board 3734, alongside the Submission team's sprints. Goal: ${sprint.goal}. The board reports 23 committed items, but four of those are ONADD DataCalc tickets — a Java 21 upgrade, a CVE, a documentation theme and a DataCalc release — so 19 are Communicator's. Snapshot ${SNAPSHOT}.`,
    headline:
      "One item Done five days from the release date, and twice as much work waiting on Product Owner review as being implemented — eight against four. Five items are still New and every one of those five is unassigned, including the performance tests for the release and three design mockups for work that belongs to a later phase.",
  },
  tickets: sprintTickets.map(withRisk),
  previousSprint: {
    name: "Yolo - Communicator Sprint 20",
    dates: "closed 12 Aug 2026",
    narrative:
      "Twenty-eight items. Three reached a terminal state and twenty stopped at Ready for integration — every one of those twenty unassigned, including the secrets fix, the industry-side redirect defect, the Keycloak client-name bug and the platform upgrade verification. Six items carried into sprint 21. The interesting number is not the carry-over, it is the twenty.",
    cards: [
      {
        title: "Actually finished",
        body: "Three items: Rforge onboarding for the team, the due-date removal UI, and the registration purpose fix for getEntityGroupMemberships — that last one delivered by an automated agent account.",
      },
      {
        title: "Resolved but not released",
        body: "Twenty items at Ready for integration, all unassigned. Credentials in git, the external-UI redirect failure, the Keycloak client-name bug, the entity-refresh race, the AI architecture review, and staging email all sit in this pile.",
      },
      {
        title: "Carried into sprint 21",
        body: "Six items, three of them still in Product Owner review: the due-date change, the broken end-to-end suite, and the registry cleanup. Review, not implementation, is where this team's work stalls.",
      },
    ],
    closed: previousSprintClosed,
    leftover: readyForIntegration.map(withRisk),
  },
  overview: {
    intro:
      "Rconnect Communicator turns supervisory correspondence into structured, auditable cases and threads. Synthesized from the RCON-276 work-package tree — Phase 1 (RCON-719), Phase 2 (RCON-919), Agentic AI (RCON-1104) and Phase 3 (RCON-1159) — board 3734, and the epic and story descriptions that carry this product's real design decisions.",
    callout:
      "The product is built. A regulator and a firm can hold a threaded conversation against a case, with private side-only threads, a follower-based notification model, and message chains migrated out of Vizor. What is not finished is everything around it: identity integration with the shared IAM platform, three deployment modes and their sizing templates, a shared cache that is still per-pod, and an AI thread summary that reached users before its architecture review found an owner. Amber, and it is the ownership pattern rather than any single defect — twenty resolved-and-unassigned items from the last sprint, a release due the day this sprint ends, and credentials sitting in git.",
    vision: [
      "Give supervision a system of record for conversation. Every question a regulator asks and every answer a firm gives belongs to a case, scoped to a reporting entity and a module, with a due date and a history — not to somebody's mailbox.",
      "Serve both sides from one product. The regulator gets the internal UI; the regulated firm gets an external UI that can be deployed on its own, and each side can hold internal-only threads its counterpart never sees.",
      "Be a module other modules use. A consuming module registers its communication dimensions, Communicator grants itself the IAM permissions to read them, and outcomes flow back to the module that owns the case. Licensing is the first, migrating its message chains out of Vizor.",
      "Owner: Kamil Matuszewski, with Anca Dobrea on the portfolio work packages. Portfolio: RCON-269 Rconnect → RCON-276 Rconnect for RSH.",
    ],
    contract: [
      "A case belongs to a reporting entity and a module. Who may see it comes from shared IAM permissions, not from Communicator's own tables — which is why module registration and permission grants are the product's real dependency.",
      "Threads carry the conversation. A general thread is visible to both sides; an internal-only thread is visible to one, enabled per installation for each side independently, and deliberately has no status at all.",
      "Notifications follow the follower model: creating a thread or posting in it makes you a follower, a new thread broadcasts to everyone permitted to see the case, and email is sent only when an in-app notification is still unread after a configured delay. Two rules are absolute — nothing about an internal-only thread ever reaches the opposing party at any administrative level, and no one who has never logged in can be notified at all.",
      "Explicitly not supported: mentions, assignee-based notification, digest emails and mobile push are all out of scope for now, and white-label configuration may restyle the header, footer and emails but never the page body.",
    ],
    layers,
    consumers,
    epics,
    architecture,
    implementation,
    deployment,
    roadmap,
  },
  backlogGantt: {
    intro:
      "Bars come from the RCON-276 work packages, their epics, and the RCON.C release versions. Dates are planning horizons drawn from epic creation dates, the release calendar, and phase sequencing — Jira due dates are empty across this tree, so treat everything except the 1.2.0 release bar as a horizon rather than a commitment.",
    caption: `Source: RCON-276 children · board 3734 · snapshot ${SNAPSHOT}. The secrets and redirect bars are marked blocked because both are resolved-and-unassigned rather than in progress.`,
    items: backlogGantt,
  },
  stakeholderGantt: {
    intro:
      "Integration roadmap for the modules, platforms and teams Communicator depends on or serves. Read this with the platform and Rcloud teams, not with the engineering backlog: most of what is blocked here is blocked on somebody else's decision or configuration.",
    highlights: [
      {
        title: "Shipped value",
        body: "Cases, threads, the dashboard, notifications, internal-only threads and module feedback are all at Ready for integration. The Licensing module's message chains are migrating out of Vizor.",
      },
      {
        title: "2026 forcing function",
        body: "RCON.C 1.2.0 on 26 Aug, and the Rcloud sizing templates that decide how the product is sized and priced. Both land inside the next sprint.",
      },
      {
        title: "Blocked on someone else",
        body: "Staging email needs Marley configuration, the platform upgrade past 26.2.0 needs the shared platform team, and the AI standards alignment needs a governance review that has not started.",
      },
    ],
    items: stakeholderGantt,
    caption: `Source: RCON-276 epics, the consuming-module tickets, and the platform and Rcloud dependencies named in RCON-1344 and RCON-1353 · snapshot ${SNAPSHOT}.`,
  },
  stakeholders,
  raci: { headers: raciHeaders, rows: raciRows },
  rice,
  bottlenecks: bottlenecks.map((b) => {
    const ticketRisk = b.ticket.startsWith("RCON-") ? TICKET_RISKS[b.ticket] : undefined;
    const extra: Record<string, Risk> = {
      "RCON-1113": {
        level: "red",
        reason:
          "A Gemini-backed feature that suggests replies and advises closing threads is in product as an experimental proof of concept, ahead of its governance.",
        mitigation:
          "Assign RCON-1293, raise RCON-1371 above Low, and record what the proof of concept proved — no ticket currently says.",
        assessment:
          "The same feature's API key is one of the credentials committed to git in RCON-1290, so the AI gap and the secrets gap are the same gap.",
        references: [
          { label: "RCON-1113", href: jira("RCON-1113") },
          { label: "RCON-1371", href: jira("RCON-1371") },
          { label: "RCON-1293", href: jira("RCON-1293") },
        ],
      },
      "RCON-977": {
        level: "amber",
        reason:
          "Most platform and identity items carry priority Not defined, none is above Low, and nearly all are labelled NoTestRequired — including the IAM and authentication changes.",
        mitigation:
          "Execute the three IAM test issues under RCON-977 that have sat at Defined, and stop labelling identity changes as needing no test.",
        assessment:
          "Permission mirroring, temporal entity group membership, and dual IAM entry points for regulator and industry are exactly the cases you cannot verify by inspection.",
        references: [{ label: "RCON-977", href: jira("RCON-977") }],
      },
      "RCON-1048": {
        level: "amber",
        reason:
          "Twenty of sprint 20's twenty-eight items are resolved and unowned at Ready for integration.",
        mitigation:
          "Treat Ready for integration as work in progress in every report, and drain this pile before adding to it. The security-relevant items should not be the ones waiting.",
        assessment:
          "The pile includes credentials in git, an authentication defect on the industry side, a Keycloak configuration bug, and the platform upgrade verification.",
        references: [{ label: "RCON-1048", href: jira("RCON-1048") }],
      },
      "RCON-276": {
        level: "amber",
        reason:
          "Four of the active sprint's twenty-three items belong to another product entirely.",
        mitigation:
          "Either split the sprint or stop reading the committed figure as Communicator capacity — the same people are committed to DataCalc in the same two weeks.",
        assessment:
          "ONADD-10788, ONADD-10795, ONADD-10796 and ONADD-10802 sit on the Communicator sprint: a Java 21 bump, a release, a CVE and a documentation theme.",
        references: [{ label: "RCON-276", href: jira("RCON-276") }],
      },
      "RCON-758": {
        level: "amber",
        reason:
          "The epics that define cases, threads, the dashboard and the UI have one-line descriptions, and the Document issues linked to them are empty.",
        mitigation:
          "Publish the domain model before Phase 3 starts adding to it, and land RCON-1264 so the documentation exists somewhere a customer can read.",
        assessment:
          "The internal-thread status decision in RCON-922 shows what a written decision looks like here. It is the exception.",
        references: [
          { label: "RCON-758", href: jira("RCON-758") },
          { label: "RCON-1264 publish docs", href: jira("RCON-1264") },
          { label: "Phase 2 RSH specification", href: CONFLUENCE.phase2 },
        ],
      },
      "RCON-1353": {
        level: "amber",
        reason:
          "Rcloud configuration templates are created ad hoc in the Rcloud UI, outside version control, in staging only.",
        mitigation:
          "Get the templates into the wrapper-chart repository and pipeline. A manual copy to production later is a step someone will forget.",
        assessment:
          "The same templates carry the sizing that feeds the pricing tool, so a hand-edited file has commercial consequences.",
        references: [
          { label: "RCON-1353", href: jira("RCON-1353") },
          { label: "RCON-1304 wrapper chart", href: jira("RCON-1304") },
        ],
      },
    };
    return { ...b, risk: ticketRisk ?? extra[b.ticket] };
  }),
  next90days:
    "Get the credentials out of git and rotate them, then root-cause the industry-side redirect failure and fix the external Keycloak client names — those three are cheap, unassigned, and the ones that would embarrass a release. Configure staging email so half the notification design stops being untested. Ship 1.2.0 with the end-to-end suite green rather than alongside it. Give the AI thread summary an owner for its architecture review and raise the standards alignment above Low, because the feature is already in front of users. Then move entity caching to Valkey and take the platform upgrade past 26.2.0 before the gap grows. Phase 3 should not start while any of this is open, and the three unassigned design mockups in the current sprint are the tell that it is starting anyway.",
  projectSummary: {
    jiraUrl: "https://regnology-cloud.atlassian.net/jira/software/c/projects/RCON/summary",
    done: 243,
    open: 58,
    highPriorityOpen: 1,
    unassignedOpen: 33,
    epics: 28,
    currentRelease: { name: "RCON.C 1.2.0", date: "26 Aug 2026", released: false },
    lastRelease: { name: "RCON.C 1.1.0", date: "27 Jul 2026" },
    narrative:
      "Counts are the RCON-276 subtree of project RCON with Xray test artefacts removed — the mirror image of the Submission scope, since one Jira project holds both products. Read the resolved figure the same way: Ready for integration sets a resolution date here too, so 243 includes a large tranche that has not been released. Two figures deserve attention. Thirty-three of the fifty-eight open items are unassigned, and only one is marked high priority — which says more about priority hygiene than about risk, given that the startup crash and the authentication defect are both Low or undefined.",
  },
  pmFocus: {
    thisSprint: [
      "Get RCON-1290 assigned today. A database password and a Gemini API key are in git, and the fix is a day's work sitting unowned.",
      "Decide whether 1.2.0 ships on 26 Aug with the end-to-end suite red and no performance baseline — RCON-1400 and RCON-1373 both need an answer before the date, not on it.",
      "Clear the Product Owner review queue: eight items are parked there against four in implementation, and three have crossed a sprint boundary.",
      "Assign or drop the five unassigned New items. Three are design mockups for Phase 3 work that should not be starting yet.",
      "Name an owner for the AI architecture review, RCON-1293, and say whether the thread summary stays enabled until it is done.",
      "Acknowledge the four DataCalc tickets in this sprint when reporting velocity, or move them out.",
    ],
    sequence: [
      {
        order: 1,
        item: "Secrets out of source control",
        ticket: "RCON-1290",
        why: "A committed credential is the only item here that is worse tomorrow than today. Cheapest high-impact fix on the board, and unassigned.",
      },
      {
        order: 2,
        item: "Industry-side authentication defects",
        ticket: "RCON-1300",
        why: "A page refresh breaking after login, plus external Keycloak clients configured with internal names. Together they mean the external UI mode is not customer-ready.",
      },
      {
        order: 3,
        item: "Release readiness for RCON.C 1.2.0",
        ticket: "RCON-1400",
        why: "The release is a sprint ticket dated the sprint end date. A green suite before that date is the difference between shipping and hoping.",
      },
      {
        order: 4,
        item: "AI standards alignment and architecture review",
        ticket: "RCON-1371",
        why: "The feature is in product. The review is unassigned and the alignment epic is New and Low — that ordering is backwards.",
      },
      {
        order: 5,
        item: "Entity refresh and shared cache",
        ticket: "RCON-1351",
        why: "A rolling update can serve an empty entity list, and entity caches are still per-pod. Both are routine operations breaking the product.",
      },
      {
        order: 6,
        item: "Chart modes, sizing templates and staging email",
        ticket: "RCON-1353",
        why: "How the product is deployed, sized, priced and tested. Held up by templates living in a UI and a staging environment with no SMTP.",
      },
    ],
    questions: [
      "Who owns the AI thread summary until RCON-1371 lands, and does it stay enabled in product while its architecture review is unassigned?",
      "Is Ready for integration a delivery state or a queue? Twenty of sprint 20's items sit there unowned, including every security-relevant fix.",
      "Does 1.2.0 ship without a performance baseline, and who accepts that?",
      "Why do the IAM and authentication changes carry NoTestRequired, and when do the three IAM test issues under RCON-977 actually run?",
      "Is RCON-1290 a Google Secret Manager change or a Jenkins credentials change? The title and the acceptance criteria disagree.",
      "Should the Communicator sprint carry DataCalc work at all, and if it must, whose capacity is being reported?",
      "When does the RCON-1213 history schema stop being provisional — before or after the first migration ships?",
      "Who publishes the domain model, given the Document issues behind the Phase 1 epics are empty and marked Published?",
    ],
  },
};
