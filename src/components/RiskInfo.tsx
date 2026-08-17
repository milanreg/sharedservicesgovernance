import { useEffect, useRef, useState } from "react";
import type { Risk } from "../template/types";

export function RiskInfo({ risk }: { risk: Risk }) {
  const hasDetail = Boolean(risk.mitigation || risk.assessment || risk.references?.length);
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!hasDetail) return null;

  return (
    <span className={`risk-info rag-${risk.level}`} ref={wrap}>
      <button
        type="button"
        className="risk-info-btn"
        aria-expanded={open}
        aria-label={`Risk details: ${risk.reason}`}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        i
      </button>
      {open ? (
        <div className="risk-info-pop" role="dialog">
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
      ) : null}
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
