import { Link, useParams } from "react-router-dom";
import { getProject } from "../data/catalog";
import { Topbar } from "../components/Topbar";
import { ProjectDashboard } from "../template/ProjectDashboard";

export function ProjectPage() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) {
    return (
      <div className="shell">
        <Topbar title="Project" />
        <main className="page">
          <p className="muted">
            <Link to="/">← Portfolio</Link>
          </p>
          <div className="coming">
            <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500 }}>Unknown project</h1>
            <p className="lede">No governance template is registered for “{slug}”.</p>
          </div>
        </main>
      </div>
    );
  }

  return <ProjectDashboard key={project.slug} project={project} />;
}
