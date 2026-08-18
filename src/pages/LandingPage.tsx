import { Link } from "react-router-dom";
import { portfolio } from "../data/catalog";
import { ragTone } from "../template/status";

export function LandingPage() {
  return (
    <main className="landing">
      <div className="landing-inner">
        <p className="kicker">Regnology · Shared Services</p>
        <h1>Project governance dashboard</h1>
        <p>
          Portfolio view of shared-service products. Sprint health, backlog
          delivery, RACI, and integration roadmaps for programme and product
          leadership.
        </p>
      </div>

      <div className="landing-cards cards">
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
  );
}
