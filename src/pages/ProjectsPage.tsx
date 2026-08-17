import { Link } from "react-router-dom";
import { Topbar } from "../components/Topbar";
import { portfolio } from "../data/catalog";
import { ragTone } from "../template/status";

export function ProjectsPage() {
  return (
    <div className="shell">
      <Topbar title="Shared Services portfolio" />
      <main className="page">
        <div className="page-head">
          <h1>Projects</h1>
          <p className="lede">
            Three products currently in the governance set. Open IAM for sprint,
            backlog, stakeholder, and ROI views sourced from Jira RSH board 2936
            and Vizor / Rconnect Confluence.
          </p>
        </div>
        <div className="cards">
          {portfolio.map((p) => (
            <Link key={p.slug} className="project-card" to={`/projects/${p.slug}`}>
              <span className={`pill ${ragTone(p.rag)}`}>{p.rag}</span>
              <h2>{p.name}</h2>
              <p>{p.summary}</p>
              <div className="meta-row">
                {p.stats.map((s) => (
                  <span className="pill" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
