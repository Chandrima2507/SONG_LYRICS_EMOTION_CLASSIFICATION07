import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import ResearchModal from "./components/ResearchModal";
import AnalyzerPage from "./pages/AnalyzerPage";
import ExplorePage from "./pages/ExplorePage";
import PlaylistsPage from "./pages/PlaylistsPage";

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [researchModalOpen, setResearchModalOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-neutral-950 text-white font-sans selection:bg-purple-600 selection:text-white">
          <Navbar
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenResearch={() => setResearchModalOpen(true)}
          />

          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={<AnalyzerPage onOpenAuth={() => setAuthModalOpen(true)} />}
              />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer onOpenResearch={() => setResearchModalOpen(true)} />

          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
          />

          <ResearchModal
            isOpen={researchModalOpen}
            onClose={() => setResearchModalOpen(false)}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
