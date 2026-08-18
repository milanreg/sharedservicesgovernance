import { Link } from "react-router-dom";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="topbar">
      <Link className="topbar-title" to="/">
        <strong>{title}</strong>
      </Link>
      <Link to="/">Shared Services</Link>
    </header>
  );
}
