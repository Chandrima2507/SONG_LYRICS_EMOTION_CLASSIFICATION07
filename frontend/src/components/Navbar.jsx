import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Music2, Sparkles, Compass, ListMusic, Info, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onOpenAuth, onOpenResearch }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Analyze", icon: Sparkles },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/playlists", label: "Playlists", icon: ListMusic },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/80 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Music2 className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-amber-300 transition-colors">
                EmoLyrics
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                NLP v2
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">Song Lyrics Emotion Classification</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 bg-neutral-900/60 p-1.5 rounded-full border border-white/5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-neutral-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-purple-600" : "text-neutral-400"}`} />
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={onOpenResearch}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <Info className="w-4 h-4 text-neutral-400" />
            Research & Team
          </button>
        </div>

        {/* User Auth / Action */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-neutral-900/80 pl-2 pr-4 py-1.5 rounded-full border border-white/10">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
              />
              <span className="text-sm font-medium text-neutral-200">{user.name}</span>
              <button
                onClick={logout}
                title="Log Out"
                className="text-neutral-400 hover:text-rose-400 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 hover:shadow-purple-600/40 hover:-translate-y-0.5 transition-all"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-neutral-900 text-neutral-300 border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? "bg-white text-black font-semibold" : "text-neutral-300 bg-neutral-900/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenResearch();
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 bg-neutral-900/60 text-left"
          >
            <Info className="w-4 h-4" />
            Research & Team
          </button>
          <div className="pt-2">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-white/10">
                <div className="flex items-center gap-2.5">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-neutral-400">{user.email}</div>
                  </div>
                </div>
                <button onClick={logout} className="p-2 text-rose-400">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-purple-600 text-white flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In / Join
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
