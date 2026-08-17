/** Single tab contract for every Shared Services project dashboard. */
export const GOVERNANCE_TABS = [
  { id: "sprint", label: "Sprint details" },
  { id: "spillover", label: "Sprint spillovers" },
  { id: "overview", label: "Product overview" },
  { id: "backlog", label: "Product Gantt" },
  { id: "stakeholders", label: "Stakeholders" },
  { id: "rice", label: "RACI & RICE" },
  { id: "value", label: "Delivery & integration Gantt" },
] as const;

export type TabId = (typeof GOVERNANCE_TABS)[number]["id"];

export function isTabId(value: string | null): value is TabId {
  return GOVERNANCE_TABS.some((tab) => tab.id === value);
}
