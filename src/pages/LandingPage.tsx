import { Link } from "react-router-dom";

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
        <Link className="btn-primary" to="/projects">
          Open project portfolio
        </Link>
      </div>
    </main>
  );
}
