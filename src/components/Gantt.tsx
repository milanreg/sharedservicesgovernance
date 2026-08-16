import { JIRA, type GanttItem } from "../data/iam";

const RANGE_START = Date.parse("2025-03-01");
const RANGE_END = Date.parse("2027-08-31");
const SPAN = RANGE_END - RANGE_START;

const TICKS = [
  "Q2 25",
  "Q3 25",
  "Q4 25",
  "Q1 26",
  "Q2 26",
  "Q3 26",
  "Q4 26",
  "H1 27",
];

function pct(iso: string) {
  const t = Date.parse(iso);
  return Math.min(100, Math.max(0, ((t - RANGE_START) / SPAN) * 100));
}

export function Gantt({ items, caption }: { items: GanttItem[]; caption: string }) {
  return (
    <div className="gantt">
      <div className="gantt-axis">
        <span>Workstream</span>
        <div className="gantt-ticks">
          {TICKS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
      {items.map((item) => {
        const left = pct(item.start);
        const right = pct(item.end);
        return (
          <div className="gantt-row" key={item.id}>
            <div className="gantt-label">
              {item.label}
              {item.ticket ? (
                <a href={`${JIRA}/${item.ticket}`} target="_blank" rel="noreferrer">
                  {item.ticket}
                </a>
              ) : null}
            </div>
            <div className="gantt-track">
              <div
                className={`gantt-bar ${item.status}`}
                style={{ left: `${left}%`, width: `${Math.max(2, right - left)}%` }}
                title={`${item.label} · ${item.start} → ${item.end}`}
              />
            </div>
          </div>
        );
      })}
      <div className="legend">
        <span>
          <i className="gantt-bar done" />
          Shipped
        </span>
        <span>
          <i className="gantt-bar active" />
          In delivery
        </span>
        <span>
          <i className="gantt-bar planned" />
          Next 90 days
        </span>
        <span>
          <i className="gantt-bar blocked" />
          Blocked
        </span>
        <span>
          <i className="gantt-bar later" />
          Later
        </span>
      </div>
      <p className="muted" style={{ margin: "10px 0 0" }}>
        {caption}
      </p>
    </div>
  );
}
