import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Music2,
  Play,
  RotateCcw,
  BookmarkPlus,
  Share2,
  Check,
  Disc3,
  Flame,
  Volume2,
  ListPlus
} from "lucide-react";
import confetti from "canvas-confetti";
import CircularProgress from "../components/CircularProgress";
import { MOOD_DEFINITIONS, EXAMPLE_LYRICS } from "../data/examples";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AnalyzerPage({ onOpenAuth }) {
  const { user } = useAuth();
  const [lyrics, setLyrics] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentMood, setCurrentMood] = useState("neutral");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [curatedPlaylist, setCuratedPlaylist] = useState(null);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAnalyze = async (textToAnalyze = lyrics) => {
    const trimmed = textToAnalyze.trim();
    if (!trimmed) return;

    setLoading(true);
    setSaved(false);

    try {
      const data = await api.analyzeLyrics({
        lyrics: trimmed,
        title: title || undefined,
        artist: artist || undefined
      });

      setResult(data);
      setCurrentMood(data.mood);

      if (data.mood === "Happy" || data.mood === "Exciting") {
        triggerConfetti();
      }

      // Fetch curated songs for this mood
      try {
        const plRes = await api.getPlaylistByMood(data.mood);
        if (plRes && plRes.playlist) {
          setCuratedPlaylist(plRes.playlist);
        }
      } catch (e) {
        // Silent playlist fallback
      }
    } catch (err) {
      console.error("Classification error:", err);
      alert(err.message || "Failed to analyze lyrics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (item) => {
    setLyrics(item.lyrics);
    setTitle(item.title);
    setArtist(item.artist);
    setResult(null);
    setCurrentMood("neutral");
    handleAnalyze(item.lyrics);
  };

  const clearForm = () => {
    setLyrics("");
    setTitle("");
    setArtist("");
    setResult(null);
    setCurrentMood("neutral");
    setCuratedPlaylist(null);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await api.saveAnalysis({
        title: title || "Analyzed Song",
        artist: artist || "Unknown Artist",
        lyrics,
        mood: result.mood,
        confidence: result.confidence,
        explanation: result.explanation,
        language: result.language
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save analysis: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `EmoLyrics Analysis:\nMood: ${result.mood} ${result.emoji}\nConfidence: ${result.confidence}%\nExplanation: ${result.explanation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = lyrics.trim() ? lyrics.trim().split(/\s+/).length : 0;
  const activeMoodInfo = MOOD_DEFINITIONS[currentMood];

  return (
    <div className="relative min-h-[calc(100vh-65px)] overflow-hidden pb-16">
      {/* Dynamic Ambient Background Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMood}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className={`fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br ${
            activeMoodInfo ? activeMoodInfo.bgClass : "from-neutral-950 via-neutral-950 to-neutral-950"
          }`}
        />
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Multi-Layered NLP Sentiment & Emotion AI</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3">
            Uncover the Emotion in Song Lyrics
          </h1>
          <p className="text-base text-neutral-400 leading-relaxed font-sans">
            Paste any verse, chorus, or poetry in <span className="text-neutral-200 font-semibold">English</span> or{" "}
            <span className="text-neutral-200 font-semibold">Hindi</span> to extract sentiment polarity, confidence score,
            and 9 core mood spectrums.
          </p>
        </motion.div>

        {/* Main Grid: Input Panel & Results Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Lyrics Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl relative">
              {/* Optional Metadata Row (Title & Artist) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Song Title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="glass-input px-4 py-2 rounded-xl text-sm placeholder:text-neutral-500"
                />
                <input
                  type="text"
                  placeholder="Artist / Band (optional)"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="glass-input px-4 py-2 rounded-xl text-sm placeholder:text-neutral-500"
                />
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  rows={10}
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Paste song lyrics here...&#10;&#10;e.g.&#10;Walking on sunshine, feeling so alive&#10;Every moment sparkles, happiness will thrive&#10;Smiles all around me, laughter fills the air&#10;Life is so amazing, not a single care"
                  className="w-full bg-transparent border-0 text-white placeholder:text-neutral-600 text-lg sm:text-xl font-sans leading-relaxed resize-none focus:outline-none focus:ring-0 min-h-[280px]"
                />
              </div>

              {/* Footer row inside input box */}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
                <div className="flex items-center gap-3">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{lyrics.length} characters</span>
                </div>
                {lyrics && (
                  <button
                    onClick={clearForm}
                    className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5">
                <button
                  onClick={() => handleAnalyze()}
                  disabled={loading || !lyrics.trim()}
                  className="w-full py-4 rounded-2xl font-display font-bold text-base sm:text-lg bg-white text-black hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                      <span>Classifying Emotional Cues...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-purple-600 group-hover:rotate-12 transition-transform" />
                      <span>Analyze Lyrical Mood</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Panel: Results & Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl min-h-[460px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result-content"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Top Result Header */}
                    <div className="text-center">
                      <div className="text-6xl mb-2 animate-bounce-short select-none">
                        {result.emoji}
                      </div>
                      <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {result.mood}
                      </h2>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-medium">
                          Language: {result.language}
                        </span>
                      </div>
                    </div>

                    {/* Circular Progress Gauge */}
                    <div className="flex justify-center py-2">
                      <CircularProgress
                        value={result.confidence}
                        color={activeMoodInfo?.color || "#a855f7"}
                        size={170}
                      />
                    </div>

                    {/* Explanation Card */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          NLP Linguistic Analysis
                        </span>
                        <Disc3 className="w-4 h-4 text-neutral-400 animate-spin-slow" />
                      </div>
                      <p className="text-sm text-neutral-200 leading-relaxed font-sans">
                        {result.explanation}
                      </p>
                      {result.detectedKeywords?.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[11px] text-neutral-400 font-medium">Matched cues:</span>
                          {result.detectedKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Save & Share */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {saved ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Saved to Library</span>
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3.5 h-3.5 text-purple-400" />
                            <span>{saving ? "Saving..." : "Save Analysis"}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCopy}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Copy Summary</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center my-auto py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-neutral-500">
                      <Music2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white mb-2">
                      Awaiting Song Lyrics
                    </h3>
                    <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
                      Type or paste lyrics on the left, or pick one of the sample tracks below to view real-time emotion metrics.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Curated Playlist Suggestion Card (if mood analyzed) */}
            {curatedPlaylist && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span className="font-display text-sm font-bold text-white">
                      Recommended Track Matches
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                    {curatedPlaylist.mood} Vibes
                  </span>
                </div>
                <div className="space-y-1.5">
                  {curatedPlaylist.songs?.slice(0, 3).map((song, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-neutral-500 font-mono w-4">{idx + 1}</span>
                        <div>
                          <div className="font-semibold text-white">{song.title}</div>
                          <div className="text-[11px] text-neutral-400">{song.artist}</div>
                        </div>
                      </div>
                      <span className="text-neutral-400 font-mono text-[11px]">{song.duration}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Example Lyrics Showcase Grid */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Try an Example from Our Curated Dataset
              </h3>
              <p className="text-sm text-neutral-400">
                Click any mood card to instantly load its verse and run classification
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {EXAMPLE_LYRICS.map((item, idx) => {
              const moodDef = MOOD_DEFINITIONS[item.mood];
              return (
                <button
                  key={idx}
                  onClick={() => loadExample(item)}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 text-left transition-all hover:-translate-y-1 shadow-lg hover:shadow-2xl"
                >
                  <img
                    src={item.image}
                    alt={item.mood}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3.5">
                    <div className="text-2xl mb-1">{moodDef?.emoji}</div>
                    <div className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {item.mood}
                    </div>
                    <div className="text-[11px] text-neutral-300 truncate">{item.title}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] text-neutral-400">
                      <span>{item.language}</span>
                      <Play className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

