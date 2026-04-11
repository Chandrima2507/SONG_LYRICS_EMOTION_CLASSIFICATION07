import { useState } from "react";
import "@/App.css";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Music2, Play } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MOOD_GRADIENTS = {
  neutral: "from-zinc-900 via-black to-zinc-900",
  Happy: "from-yellow-400 via-orange-500 to-amber-600",
  Sad: "from-blue-900 via-slate-900 to-indigo-950",
  Angry: "from-red-700 via-red-950 to-black",
  Romantic: "from-pink-500 via-fuchsia-600 to-purple-700",
  "Calm/Chill": "from-teal-200 via-emerald-200 to-green-300",
  Exciting: "from-orange-500 via-purple-600 to-violet-700",
  Patriotic: "from-orange-500 via-white to-green-600",
  Thrilling: "from-purple-900 via-fuchsia-950 to-black",
  Horror: "from-red-950 via-black to-red-900"
};

const MOOD_EMOJIS = {
  Happy: "☀️",
  Sad: "🌧️",
  Angry: "🔥",
  Romantic: "💖",
  "Calm/Chill": "🌿",
  Exciting: "⚡",
  Patriotic: "🇮🇳",
  Thrilling: "🎬",
  Horror: "👻"
};

const EXAMPLE_LYRICS = [
  {
    mood: "Happy",
    image: "https://static.prod-images.emergentagent.com/jobs/dd6014d5-19a2-4f93-bcd7-c3e8f8c8f1dc/images/c2cb32f410fe289625466e8aaf920fe3350a24bdad6ece6e891478603b4214d4.png",
    lyrics: "Walking on sunshine, feeling so alive\nEvery moment sparkles, happiness will thrive\nSmiles all around me, laughter fills the air\nLife is so amazing, not a single care"
  },
  {
    mood: "Sad",
    image: "https://static.prod-images.emergentagent.com/jobs/dd6014d5-19a2-4f93-bcd7-c3e8f8c8f1dc/images/a2a01d477180321097b93249bb145dd251238bc41084cc9f449f0b2caf27240f.png",
    lyrics: "Tears fall like rain on my window pane\nLoneliness whispers, echoing my pain\nMemories of you haunt me every night\nIn this empty room, nothing feels right"
  },
  {
    mood: "Angry",
    image: "https://static.prod-images.emergentagent.com/jobs/dd6014d5-19a2-4f93-bcd7-c3e8f8c8f1dc/images/b20c3ff348bdae436b0a74b0c7f1d10dc0eb2aa76d4dc3bb4c9d8b705a46d8dc.png",
    lyrics: "Fire burning inside, rage I cannot hide\nBroken promises, you lied and lied\nShattered trust, this fury will not fade\nYou crossed the line, now the price must be paid"
  },
  {
    mood: "Romantic",
    image: "https://static.prod-images.emergentagent.com/jobs/dd6014d5-19a2-4f93-bcd7-c3e8f8c8f1dc/images/60c12654df3470b4a3e88e71876d497ef8297e776c7f11dc608615e25de92b47.png",
    lyrics: "Your eyes hold galaxies, your smile lights my way\nIn your arms forever, is where I want to stay\nEvery kiss a promise, every touch so sweet\nOur love is endless, two hearts that beat"
  },
  {
    mood: "Calm/Chill",
    image: "https://static.prod-images.emergentagent.com/jobs/dd6014d5-19a2-4f93-bcd7-c3e8f8c8f1dc/images/e51d3c95249babc794992ffc6c83da715d40a83a62c9ceaead1971169c20f6d5.png",
    lyrics: "Soft breeze whispers through the trees\nPeaceful moments, mind at ease\nWaves gently rolling on the shore\nIn this stillness, I need nothing more"
  },
  {
    mood: "Exciting",
    image: "https://static.prod-images.emergentagent.com/jobs/dd6014d5-19a2-4f93-bcd7-c3e8f8c8f1dc/images/56e9621ff0af09e66a3a82a411dcaa2b89be56c04233e9e3f285acee26e9650c.png",
    lyrics: "Electric energy, we're ready to ignite\nPumping through our veins, we own the night\nNo limits, no boundaries, we're breaking free\nThis adrenaline rush is all we need to be"
  },
  {
    mood: "Patriotic",
    image: "https://static.prod-images.emergentagent.com/jobs/dd6014d5-19a2-4f93-bcd7-c3e8f8c8f1dc/images/953cb851102338037d93ed64d723daf151b808e5fdadad61185748ca03d77f9c.png",
    lyrics: "Our flag waves high with pride and grace\nUnited we stand, a strong embrace\nFor our nation we'll always fight\nOur motherland, our guiding light"
  },
  {
    mood: "Horror",
    image: "https://static.prod-images.emergentagent.com/jobs/dd6014d5-19a2-4f93-bcd7-c3e8f8c8f1dc/images/6046f84d59ae9749dc18de3d8321a063957863ad9e7be0d16ff3f18a21506c23.png",
    lyrics: "Shadows creeping, darkness calling\nEerie silence, terror's falling\nWhispers echo from the grave\nNo escape, no one to save"
  },
  {
    mood: "Thrilling",
    image: "https://images.pexels.com/photos/11829357/pexels-photo-11829357.jpeg",
    lyrics: "On the edge, heart racing fast\nDanger lurking, shadows cast\nMystery unfolds, suspense so high\nIn this moment, we're alive or die"
  }
];

function CircularProgress({ value }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          fill="none"
        />
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          stroke="white"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-bold font-[Outfit]"
        >
          {Math.round(value)}%
        </motion.div>
      </div>
    </div>
  );
}

function App() {
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentMood, setCurrentMood] = useState("neutral");

  const analyzeMood = async () => {
    if (!lyrics.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/analyze-mood`, { lyrics });
      setResult(response.data);
      setCurrentMood(response.data.mood);
    } catch (error) {
      console.error("Error analyzing mood:", error);
      alert("Failed to analyze mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (example) => {
    setLyrics(example.lyrics);
    setResult(null);
    setCurrentMood("neutral");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMood}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className={`fixed inset-0 bg-gradient-to-br ${MOOD_GRADIENTS[currentMood]} -z-10`}
        />
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music2 className="w-10 h-10" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-bold font-[Outfit]">
              Lyric Mood
            </h1>
            <Sparkles className="w-10 h-10" />
          </div>
          <p className="text-base leading-relaxed font-[Manrope] text-zinc-300">
            Discover the emotional essence of any song
          </p>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Lyrics Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="bg-black/50 backdrop-blur-3xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight font-semibold font-[Outfit] mb-6">
                Paste Your Lyrics
              </h2>
              <textarea
                data-testid="lyrics-textarea"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Enter song lyrics here...\n\nFor example:\n'Walking on sunshine, feeling so alive\nEvery moment sparkles...'" 
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-xl md:text-2xl leading-relaxed resize-none w-full min-h-[400px] text-white placeholder:text-zinc-500 font-[Manrope]"
              />
              <div className="mt-6">
                <button
                  data-testid="analyze-button"
                  onClick={analyzeMood}
                  disabled={loading || !lyrics.trim()}
                  className="w-full rounded-full px-8 py-6 text-lg font-semibold font-[Outfit] bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                  style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze Mood
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4"
          >
            <div className="bg-black/50 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center w-full"
                  >
                    <div className="text-7xl mb-6">{MOOD_EMOJIS[result.mood]}</div>
                    <h3 data-testid="mood-result" className="text-3xl sm:text-4xl font-bold font-[Outfit] mb-8">
                      {result.mood}
                    </h3>
                    <CircularProgress value={result.confidence} />
                    <p className="text-sm text-zinc-400 font-[Manrope] tracking-wide mt-4 mb-8">
                      CONFIDENCE
                    </p>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold font-[Outfit] mb-3">Analysis</h4>
                      <p className="text-base leading-relaxed font-[Manrope] text-zinc-300">
                        {result.explanation}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <Music2 className="w-24 h-24 mx-auto mb-6 text-white/20" />
                    <p className="text-base leading-relaxed font-[Manrope] text-zinc-400">
                      Enter lyrics and click analyze to see the mood
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Example Lyrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 max-w-7xl mx-auto"
        >
          <h3 className="text-2xl sm:text-3xl tracking-tight font-semibold font-[Outfit] mb-6 text-center">
            Try an Example
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {EXAMPLE_LYRICS.map((example, index) => (
              <motion.button
                key={example.mood}
                data-testid={`example-${example.mood.toLowerCase().replace(/\//g, '-')}`}
                onClick={() => loadExample(example)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-white/30"
                style={{ transition: "border 0.2s" }}
              >
                <img
                  src={example.image}
                  alt={example.mood}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-4">
                  <div className="text-3xl mb-2">{MOOD_EMOJIS[example.mood]}</div>
                  <p className="text-sm font-semibold font-[Outfit]">{example.mood}</p>
                  <Play className="w-5 h-5 mt-2 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.2s" }} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;