import { Link } from "react-router-dom";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="topbar">
      <strong>{title}</strong>
      <Link to="/">Shared Services</Link>
    </header>
  );
}
