import { useState, useEffect } from "react";
import { ListMusic, Play, Pause, Volume2, Sparkles, Disc, Clock, Music } from "lucide-react";
import { api } from "../services/api";
import { MOOD_DEFINITIONS } from "../data/examples";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMood, setActiveMood] = useState("Happy");
  const [playingSong, setPlayingSong] = useState(null);

  useEffect(() => {
    async function loadPlaylists() {
      try {
        const res = await api.getPlaylists();
        setPlaylists(res.playlists || []);
      } catch (err) {
        console.error("Failed to load playlists:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPlaylists();
  }, []);

  const currentPlaylist =
    playlists.find((p) => p.mood.toLowerCase() === activeMood.toLowerCase()) ||
    playlists[0];

  const moodInfo = MOOD_DEFINITIONS[activeMood] || MOOD_DEFINITIONS.Happy;

  const togglePlaySong = (songTitle) => {
    if (playingSong === songTitle) {
      setPlayingSong(null);
    } else {
      setPlayingSong(songTitle);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
          <ListMusic className="w-4 h-4" />
          <span>Mood-Harmonized Soundtracks</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          Curated Mood Playlists
        </h1>
        <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
          Listen to songs synchronized with detected emotional profiles — from tranquil acoustic sessions to high-voltage rock anthems.
        </p>
      </div>

      {/* Mood Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {Object.keys(MOOD_DEFINITIONS).map((m) => {
          const isSelected = activeMood === m;
          const def = MOOD_DEFINITIONS[m];
          return (
            <button
              key={m}
              onClick={() => {
                setActiveMood(m);
                setPlayingSong(null);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isSelected
                  ? "bg-white text-black shadow-lg font-bold scale-105"
                  : "bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5"
              }`}
            >
              <span>{def.emoji}</span>
              <span>{m}</span>
            </button>
          );
        })}
      </div>

      {/* Main Playlist Content */}
      {loading ? (
        <div className="py-20 text-center text-neutral-400">Loading playlists...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Playlist Card Hero */}
          <div className="lg:col-span-5">
            <div className={`p-8 rounded-3xl bg-gradient-to-br ${moodInfo.gradient} text-white shadow-2xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-4">
                <div className="text-6xl">{moodInfo.emoji}</div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-white/80 font-bold">
                    Official EmoLyrics Playlist
                  </span>
                  <h2 className="font-display text-3xl font-extrabold text-white mt-1">
                    {currentPlaylist?.title || `${activeMood} Vibes`}
                  </h2>
                </div>
                <p className="text-sm text-white/90 leading-relaxed font-sans">
                  {currentPlaylist?.description || moodInfo.description}
                </p>
                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs text-white/80">
                  <span>{currentPlaylist?.songs?.length || 4} Tracks Curated</span>
                  <span>Audio Sync Enabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Song Tracks List */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 text-xs font-semibold uppercase text-neutral-400 tracking-wider">
              <span>Track Title & Artist</span>
              <div className="flex items-center gap-6">
                <span>Duration</span>
                <span>Play</span>
              </div>
            </div>

            <div className="space-y-2">
              {currentPlaylist?.songs?.map((song, idx) => {
                const isPlaying = playingSong === song.title;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                      isPlaying
                        ? "bg-white/15 border border-purple-500/30 text-white"
                        : "bg-white/5 hover:bg-white/10 text-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center text-xs font-mono text-neutral-400">
                        {isPlaying ? (
                          <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{song.title}</div>
                        <div className="text-xs text-neutral-400">{song.artist}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-xs font-mono text-neutral-400">{song.duration}</span>
                      <button
                        onClick={() => togglePlaySong(song.title)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isPlaying
                            ? "bg-amber-400 text-black shadow-lg shadow-amber-400/40"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                        title={isPlaying ? "Pause Preview" : "Play Preview"}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-black" />
                        ) : (
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

