import type { Risk } from "../template/types";

export function RiskInfo({ risk }: { risk: Risk }) {
  const hasDetail = Boolean(risk.mitigation || risk.assessment || risk.references?.length);
  if (!hasDetail) return null;

  return (
    <span className={`risk-info rag-${risk.level}`}>
      <button
        type="button"
        className="risk-info-btn"
        aria-label={`Risk details: ${risk.reason}`}
      >
        i
      </button>
      <div className="risk-info-pop" role="tooltip">
        <p className="risk-info-kicker">{risk.level === "red" ? "Red risk" : "Amber risk"}</p>
        <p>
          <strong>Reason.</strong> {risk.reason}
        </p>
        {risk.mitigation ? (
          <p>
            <strong>Mitigation.</strong> {risk.mitigation}
          </p>
        ) : null}
        {risk.assessment ? (
          <p>
            <strong>Assessment.</strong> {risk.assessment}
          </p>
        ) : null}
        {risk.references?.length ? (
          <p className="risk-info-refs">
            {risk.references.map((ref) => (
              <a key={ref.href} href={ref.href} target="_blank" rel="noreferrer">
                {ref.label}
              </a>
            ))}
          </p>
        ) : null}
      </div>
    </span>
  );
}

export function RiskReason({ risk }: { risk: Risk }) {
  return (
    <span className="risk-reason">
      <span className={`risk-dot rag-${risk.level}`} />
      <span>{risk.reason}</span>
      <RiskInfo risk={risk} />
    </span>
  );
}
