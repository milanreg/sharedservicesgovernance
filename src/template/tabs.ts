/** Single tab contract for every Shared Services project dashboard. */
export const GOVERNANCE_TABS = [
  { id: "overview", label: "Product overview" },
  { id: "sprint", label: "Sprint details" },
  { id: "spillover", label: "Sprint spillovers" },
  { id: "backlog", label: "Product Gantt" },
  { id: "stakeholders", label: "Stakeholders" },
  { id: "rice", label: "RACI & RICE" },
  { id: "value", label: "Delivery & integration Gantt" },
] as const;

export const DEFAULT_TAB = GOVERNANCE_TABS[0].id;

export type TabId = (typeof GOVERNANCE_TABS)[number]["id"];

export function isTabId(value: string | null): value is TabId {
  return GOVERNANCE_TABS.some((tab) => tab.id === value);
}
