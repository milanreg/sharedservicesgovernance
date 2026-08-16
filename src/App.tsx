import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { IamDashboardPage } from "./pages/IamDashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { ProjectsPage } from "./pages/ProjectsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/iam" element={<IamDashboardPage />} />
        <Route path="/projects/:slug" element={<ComingSoonPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
