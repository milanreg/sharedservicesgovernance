import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Risk } from "../template/types";

const MARGIN = 8;

type Point = { top: number; left: number };

export function RiskInfo({ risk }: { risk: Risk }) {
  const hasDetail = Boolean(risk.mitigation || risk.assessment || risk.references?.length);
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState<Point | null>(null);
  const wrap = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);

  /** Anchor beside the icon, then pull the popover back inside the viewport. */
  const place = useCallback(() => {
    const anchor = button.current?.getBoundingClientRect();
    const panel = pop.current;
    if (!anchor || !panel) return;

    const { offsetWidth: width, offsetHeight: height } = panel;
    const maxLeft = window.innerWidth - width - MARGIN;
    const maxTop = window.innerHeight - height - MARGIN;

    let left = anchor.left - width - MARGIN;
    if (left < MARGIN) left = anchor.right + MARGIN;

    setPoint({
      left: Math.max(MARGIN, Math.min(left, maxLeft)),
      top: Math.max(MARGIN, Math.min(anchor.top, maxTop)),
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPoint(null);
      return;
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrap.current?.contains(target) || pop.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!hasDetail) return null;

  return (
    <span className={`risk-info rag-${risk.level}`} ref={wrap}>
      <button
        type="button"
        ref={button}
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
        <div
          className="risk-info-pop"
          role="dialog"
          ref={pop}
          style={{
            top: point?.top ?? 0,
            left: point?.left ?? 0,
            visibility: point ? "visible" : "hidden",
          }}
        >
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
