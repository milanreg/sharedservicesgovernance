import { Link, useParams } from "react-router-dom";
import { Topbar } from "../components/Topbar";
import { projects } from "../data/iam";

export function ComingSoonPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  return (
    <div className="shell">
      <Topbar title={project?.name ?? "Project"} />
      <main className="page">
        <p className="muted">
          <Link to="/projects">← Portfolio</Link>
        </p>
        <div className="coming">
          <span className="pill teal">Governance tabs next</span>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, margin: "12px 0 8px" }}>
            {project?.full ?? "Project"}
          </h1>
          <p className="lede" style={{ marginBottom: 0 }}>
            {project?.summary} Connect a product briefing the same way as IAM to
            unlock sprint, spillover, RACI, and integration Gantt views.
          </p>
        </div>
      </main>
    </div>
  );
}
