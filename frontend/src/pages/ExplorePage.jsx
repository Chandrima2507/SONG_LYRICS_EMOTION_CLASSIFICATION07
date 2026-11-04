import { useState, useEffect } from "react";
import { Search, Compass, Music, Trash2, ArrowUpRight, Sparkles, Filter, Loader2 } from "lucide-react";
import { api } from "../services/api";
import { MOOD_DEFINITIONS } from "../data/examples";
import { useAuth } from "../context/AuthContext";

export default function ExplorePage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMood, setSelectedMood] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const moodsList = ["All", ...Object.keys(MOOD_DEFINITIONS)];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalyses({
        mood: selectedMood,
        search,
        page,
        limit: 9
      });
      setAnalyses(res.items || []);
      setPagination(res.pagination || { total: 0, pages: 1 });
    } catch (err) {
      console.error("Failed to fetch analyses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedMood, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this analysis?")) return;
    try {
      await api.deleteAnalysis(id);
      setAnalyses(analyses.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to delete analysis: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
          <Compass className="w-4 h-4" />
          <span>Lyrical Emotion Database</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          Explore Analyzed Song Lyrics
        </h1>
        <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
          Browse community tracks, benchmark dataset classifications, and lyrical sentiment across 9 discrete mood spectrums.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4 mb-8">
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by song title, artist, or lyrical phrase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-24 py-3 rounded-2xl glass-panel text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        {/* Mood Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {moodsList.map((m) => {
            const isSelected = selectedMood === m;
            const emoji = MOOD_DEFINITIONS[m]?.emoji || "";
            return (
              <button
                key={m}
                onClick={() => {
                  setSelectedMood(m);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-white text-black shadow-md font-bold scale-105"
                    : "bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5"
                }`}
              >
                {emoji && <span>{emoji}</span>}
                <span>{m}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Analyses */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-3" />
          <p className="text-sm">Fetching lyric analyses...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl p-8 border border-white/10 max-w-lg mx-auto">
          <Music className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-white mb-1">No Analyses Found</h3>
          <p className="text-xs text-neutral-400">
            Try adjusting your search keywords or mood filter to explore more tracks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((item) => {
            const moodInfo = MOOD_DEFINITIONS[item.mood];
            return (
              <div
                key={item._id}
                className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between border border-white/10 relative group"
              >
                <div>
                  {/* Top Row: Mood Badge & Confidence */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{moodInfo?.emoji || "🎵"}</span>
                      <div>
                        <div className="font-display font-bold text-sm text-white">{item.mood}</div>
                        <div className="text-[10px] text-neutral-400">{item.language || "English"}</div>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-bold text-white font-mono">
                      {Math.round(item.confidence)}%
                    </div>
                  </div>

                  {/* Title & Artist */}
                  <h3 className="font-display font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                    {item.title || "Untitled Track"}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-3">{item.artist || "Unknown Artist"}</p>

                  {/* Lyrics Snippet */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 mb-4">
                    <p className="text-xs text-neutral-300 italic line-clamp-3 leading-relaxed whitespace-pre-line font-sans">
                      "{item.lyrics}"
                    </p>
                  </div>

                  {/* Explanation summary */}
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>

                {/* Footer details & delete button if authenticated */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Verified"}
                  </span>
                  {user && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                      title="Delete Analysis"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-white disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-neutral-400 px-3">
            Page {page} of {pagination.pages}
          </span>
          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

