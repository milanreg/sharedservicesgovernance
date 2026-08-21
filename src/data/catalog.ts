import { iamGovernance, TICKET_RISKS } from "./iamGovernance";
import {
  rconnectSubmissionGovernance,
  TICKET_RISKS as RCON_SUBMISSION_RISKS,
} from "./rconnectSubmissionGovernance";
import {
  rconnectCommunicatorGovernance,
  TICKET_RISKS as RCON_COMMUNICATOR_RISKS,
} from "./rconnectCommunicatorGovernance";
import { applyLive, bundledSnapshot } from "./live";
import type { ProjectGovernance, Risk } from "../template/types";

/**
 * Resolved once here rather than per page, so the portfolio cards and the
 * dashboard can never quote different numbers for the same product.
 */
function withLive(project: ProjectGovernance, risks: Record<string, Risk>): ProjectGovernance {
  const snapshot = bundledSnapshot(project.slug);
  return snapshot ? applyLive(project, snapshot, risks) : project;
}

const iam = withLive(iamGovernance, TICKET_RISKS);
const rconnectSubmission = withLive(rconnectSubmissionGovernance, RCON_SUBMISSION_RISKS);
const rconnectCommunicator = withLive(rconnectCommunicatorGovernance, RCON_COMMUNICATOR_RISKS);

export const portfolio = [
  {
    slug: iam.slug,
    name: iam.name,
    full: iam.fullName,
    rag: iam.rag,
    summary: iam.summary,
    stats: [
      `${iam.projectSummary.done} closed`,
      `${iam.projectSummary.open} still open`,
      `${iam.sprint.name} active`,
    ],
  },
  {
    slug: rconnectSubmission.slug,
    name: rconnectSubmission.name,
    full: rconnectSubmission.fullName,
    rag: rconnectSubmission.rag,
    summary: rconnectSubmission.summary,
    stats: [
      `${rconnectSubmission.projectSummary.done} resolved`,
      `${rconnectSubmission.projectSummary.open} still open`,
      `${rconnectSubmission.sprint.name} active`,
    ],
  },
  {
    slug: rconnectCommunicator.slug,
    name: rconnectCommunicator.name,
    full: rconnectCommunicator.fullName,
    rag: rconnectCommunicator.rag,
    summary: rconnectCommunicator.summary,
    stats: [
      `${rconnectCommunicator.projectSummary.done} resolved`,
      `${rconnectCommunicator.projectSummary.open} still open`,
      `${rconnectCommunicator.sprint.name} active`,
    ],
  },
];

const bySlug: Record<string, ProjectGovernance> = {
  iam,
  "rconnect-submission": rconnectSubmission,
  "rconnect-communicator": rconnectCommunicator,
};

/** Risk assessments are keyed by ticket so they survive a sync. */
const risksBySlug: Record<string, Record<string, Risk>> = {
  iam: TICKET_RISKS,
  "rconnect-submission": RCON_SUBMISSION_RISKS,
  "rconnect-communicator": RCON_COMMUNICATOR_RISKS,
};

export function getProject(slug: string | undefined): ProjectGovernance | undefined {
  if (!slug) return undefined;
  return bySlug[slug];
}

export function getTicketRisks(slug: string): Record<string, Risk> {
  return risksBySlug[slug] ?? {};
}
