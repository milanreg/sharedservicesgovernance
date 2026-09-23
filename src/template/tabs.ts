/** Single tab contract for every Shared Services project dashboard. */
export const GOVERNANCE_TABS = [
  { id: "overview", label: "Product overview" },
  { id: "sprint", label: "Sprint details" },
  { id: "backlog", label: "Product Gantt" },
  { id: "stakeholders", label: "Stakeholders" },
  { id: "value", label: "Delivery & integration Gantt" },
] as const;

/** Older URLs and chat deep-links still resolve these, but they are not in the nav. */
const HIDDEN_TABS = ["spillover", "rice"] as const;

export type TabId = (typeof GOVERNANCE_TABS)[number]["id"] | (typeof HIDDEN_TABS)[number];

export function isTabId(value: string | null): value is TabId {
  if (!value) return false;
  return (
    GOVERNANCE_TABS.some((tab) => tab.id === value) || (HIDDEN_TABS as readonly string[]).includes(value)
  );
}
