import { iamGovernance } from "./iamGovernance";
import { emptyProject, type ProjectGovernance } from "../template/types";

export const portfolio = [
  {
    slug: iamGovernance.slug,
    name: iamGovernance.name,
    full: iamGovernance.fullName,
    rag: iamGovernance.rag,
    summary: iamGovernance.summary,
    stats: ["634 [IAM] closed", "209 still open", "Sprint 2616 active"],
  },
  {
    slug: "rconnect-submission",
    name: "RCONNECT SUBMISSION",
    full: "Rconnect Submission",
    rag: "TBD" as const,
    summary:
      "Submission flow across Rcloud / NiFi. Same governance tabs as IAM; briefing not yet connected.",
    stats: ["Template ready", "Jira not yet wired"],
  },
  {
    slug: "rconnect-communicator",
    name: "RCONNECT COMMUNICATOR",
    full: "Rconnect Communicator",
    rag: "TBD" as const,
    summary:
      "Supervisory messaging module. Same governance tabs as IAM; briefing not yet connected.",
    stats: ["Template ready", "Jira not yet wired"],
  },
] as const;

const rconnectSubmission: ProjectGovernance = emptyProject({
  slug: "rconnect-submission",
  name: "RCONNECT SUBMISSION",
  fullName: "Rconnect Submission",
  platform: "Rconnect",
  summary: portfolio[1].summary,
});

const rconnectCommunicator: ProjectGovernance = emptyProject({
  slug: "rconnect-communicator",
  name: "RCONNECT COMMUNICATOR",
  fullName: "Rconnect Communicator",
  platform: "Rconnect",
  summary: portfolio[2].summary,
});

const bySlug: Record<string, ProjectGovernance> = {
  iam: iamGovernance,
  "rconnect-submission": rconnectSubmission,
  "rconnect-communicator": rconnectCommunicator,
};

export function getProject(slug: string | undefined): ProjectGovernance | undefined {
  if (!slug) return undefined;
  return bySlug[slug];
}
