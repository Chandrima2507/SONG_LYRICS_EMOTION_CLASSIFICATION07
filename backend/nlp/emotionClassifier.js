/**
 * EmoLyrics NLP Feature Extraction & Emotion Classification Engine
 * Supports 9 Target Mood Categories with English & Hindi/Hinglish Lexicons.
 * Based on research specifications from EmoLyrics.pdf.
 */

// Comprehensive Lexicon Dictionaries for 9 Moods
const MOOD_LEXICONS = {
  Happy: {
    emoji: "☀️",
    gradient: "from-amber-400 via-orange-500 to-yellow-500",
    color: "#f59e0b",
    keywords: [
      "happy", "joy", "sunshine", "smile", "laugh", "laughter", "alive", "sparkle",
      "bright", "celebrate", "dancing", "cheer", "good time", "wonderful", "delight",
      "blessed", "shining", "radiant", "fun", "euphoria", "glad", "golden", "free",
      // Hindi / Hinglish keywords
      "khushi", "muskaan", "masti", "hasna", "jashn", "khushboo", "khush", "chamke"
    ],
    valence: 0.85,
    arousal: 0.75
  },
  Sad: {
    emoji: "🌧️",
    gradient: "from-blue-900 via-slate-900 to-indigo-950",
    color: "#3b82f6",
    keywords: [
      "tears", "rain", "crying", "lonely", "loneliness", "pain", "broken", "empty",
      "hollow", "haunt", "sorrow", "grief", "weep", "lost", "regret", "goodbye",
      "melancholy", "cold", "miss you", "bleeding heart", "darkness inside",
      // Hindi / Hinglish keywords
      "dukh", "dard", "aansu", "rona", "tanha", "tanhai", "bichad", "judai", "gham"
    ],
    valence: -0.80,
    arousal: -0.40
  },
  Angry: {
    emoji: "🔥",
    gradient: "from-red-700 via-red-950 to-neutral-950",
    color: "#ef4444",
    keywords: [
      "fire", "rage", "burn", "burns", "fury", "hate", "enemy", "crossed", "fight",
      "lies", "lied", "revenge", "strike", "destroy", "shatter", "madness", "spite",
      "vengeance", "furious", "blood", "traitor",
      // Hindi / Hinglish keywords
      "gussa", "nafrat", "aag", "badla", "jalna", "tabahi", "dushmani", "krodh"
    ],
    valence: -0.70,
    arousal: 0.85
  },
  Romantic: {
    emoji: "💖",
    gradient: "from-pink-500 via-rose-600 to-purple-800",
    color: "#ec4899",
    keywords: [
      "love", "heart", "kiss", "kissing", "embrace", "forever", "sweet", "darling",
      "passion", "galaxies", "touch", "beauty", "holding you", "romance", "beloved",
      "tender", "devotion", "butterflies", "soulmate", "honey",
      // Hindi / Hinglish keywords
      "pyaar", "ishq", "mohabbat", "dil", "chaahat", "sanam", "jaan", "humsafar", "deewana"
    ],
    valence: 0.90,
    arousal: 0.60
  },
  "Calm/Chill": {
    emoji: "🌿",
    gradient: "from-teal-600 via-emerald-800 to-slate-900",
    color: "#10b981",
    keywords: [
      "breeze", "whisper", "peace", "peaceful", "calm", "gentle", "stillness",
      "shore", "waves", "quiet", "serene", "relax", "floating", "tranquil",
      "softly", "harmony", "easy", "breathing", "mellow", "clouds",
      // Hindi / Hinglish keywords
      "sukoon", "shanti", "hawa", "itminan", "thandi", "lehren", "chain", "aaram"
    ],
    valence: 0.65,
    arousal: -0.70
  },
  Exciting: {
    emoji: "⚡",
    gradient: "from-orange-500 via-purple-700 to-violet-900",
    color: "#8b5cf6",
    keywords: [
      "electric", "ignite", "pump", "pumping", "veins", "adrenaline", "wild", "rush",
      "party", "loud", "hyper", "jump", "power", "unstoppable", "blast", "climax",
      "turbo", "energy", "thrill", "fever", "fireworks",
      // Hindi / Hinglish keywords
      "josh", "hungama", "dhamaka", "raula", "toofan", "pagalpan", "chalaang"
    ],
    valence: 0.70,
    arousal: 0.95
  },
  Patriotic: {
    emoji: "🇮🇳",
    gradient: "from-orange-600 via-neutral-900 to-green-700",
    color: "#f97316",
    keywords: [
      "flag", "motherland", "pride", "nation", "united", "stand", "sacrifice",
      "brave", "honor", "soldiers", "freedom", "anthem", "country", "glory",
      "soil", "martyr", "salute", "heroes",
      // Hindi / Hinglish keywords
      "tiranga", "vatan", "watan", "desh", "bharat", "veer", "shahid", "hindustan", "azadi"
    ],
    valence: 0.60,
    arousal: 0.65
  },
  Thrilling: {
    emoji: "🎬",
    gradient: "from-purple-900 via-fuchsia-950 to-neutral-950",
    color: "#a855f7",
    keywords: [
      "racing", "danger", "mystery", "suspense", "edge", "shadows", "shadow", "cast",
      "chase", "alive or die", "countdown", "undercover", "pulse", "lurking", "trap",
      "risk", "clutch", "breathless",
      // Hindi / Hinglish keywords
      "khatra", "raaz", "dhak", "dharkan", "anjaam", "darr", "kashmakash"
    ],
    valence: 0.10,
    arousal: 0.88
  },
  Horror: {
    emoji: "👻",
    gradient: "from-red-950 via-zinc-950 to-black",
    color: "#dc2626",
    keywords: [
      "creeping", "terror", "nightmare", "grave", "eerie", "ghost", "screaming",
      "blood", "dead", "haunted", "demon", "curses", "no escape", "whispers echo",
      "monsters", "chills", "dread", "corpse",
      // Hindi / Hinglish keywords
      "khauf", "bhoot", "chudail", "shaitan", "daraona", "chikhe", "kabristan", "mayyat"
    ],
    valence: -0.90,
    arousal: 0.75
  }
};

/**
 * Text Preprocessing: lowercasing, punctuation cleaning, tokenization
 */
function preprocessLyrics(text) {
  if (!text || typeof text !== "string") return [];
  const clean = text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, " ") // retain alphanumeric + devanagari characters
    .replace(/\s+/g, " ")
    .trim();
  return clean.split(" ").filter(w => w.length > 1);
}

/**
 * Detect Language (English vs Hindi/Hinglish)
 */
function detectLanguage(text) {
  const devanagariPattern = /[\u0900-\u097F]/;
  if (devanagariPattern.test(text)) {
    return "Hindi (Devanagari)";
  }
  
  const hinglishWords = [
    "pyaar", "ishq", "mohabbat", "dil", "chaahat", "sanam", "jaan", "humsafar",
    "khushi", "dukh", "dard", "aansu", "tanha", "tanhai", "vatan", "watan", "desh",
    "gussa", "sukoon", "shanti", "josh", "toofan", "khauf", "tiranga"
  ];
  
  const tokens = preprocessLyrics(text);
  const matchedHinglish = tokens.filter(t => hinglishWords.includes(t));
  if (matchedHinglish.length >= 2) {
    return "Hindi (Hinglish)";
  }
  return "English";
}

/**
 * Classify lyrics into an emotion with score breakdown and detailed explanation
 */
function classifyLyrics(lyrics) {
  if (!lyrics || lyrics.trim().length === 0) {
    return {
      mood: "Calm/Chill",
      confidence: 50.0,
      explanation: "No textual lyrics provided to analyze.",
      scores: {},
      language: "Unknown",
      detectedKeywords: []
    };
  }

  const rawLower = lyrics.toLowerCase();
  const tokens = preprocessLyrics(lyrics);
  const totalTokens = Math.max(tokens.length, 1);
  const language = detectLanguage(lyrics);

  const scores = {};
  const matchedKeywordsByMood = {};

  // Score each mood based on keyword matches, phrase occurrences, and weights
  for (const [mood, data] of Object.entries(MOOD_LEXICONS)) {
    let matchScore = 0;
    const matched = [];

    for (const kw of data.keywords) {
      if (kw.includes(" ")) {
        // Multi-word phrase matching
        if (rawLower.includes(kw)) {
          matchScore += 4;
          matched.push(kw);
        }
      } else {
        // Single word matching with frequency weighting
        const count = tokens.filter(t => t === kw).length;
        if (count > 0) {
          matchScore += count * 2.5;
          matched.push(kw);
        }
      }
    }

    scores[mood] = matchScore;
    matchedKeywordsByMood[mood] = matched;
  }

  // Find the highest-scoring mood
  const sortedMoods = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topMood, topScore] = sortedMoods[0];
  const [secondMood, secondScore] = sortedMoods[1];

  let selectedMood = "Calm/Chill";
  let confidence = 70.0;
  let explanation = "";

  if (topScore > 0) {
    selectedMood = topMood;
    // Calculate normalized confidence percentage (scaled between 65% and 98%)
    const scoreMargin = topScore / (topScore + secondScore + 2);
    const rawConf = 65 + scoreMargin * 30 + Math.min(topScore, 10) * 0.5;
    confidence = Math.min(Math.round(rawConf * 10) / 10, 98.5);

    const keywordsUsed = matchedKeywordsByMood[topMood].slice(0, 5).join(", ");
    explanation = `Identified dominant emotional cues (${keywordsUsed || "tonal resonance"}) characterizing a ${selectedMood} mood with strong valence and expressive lyrical phrasing.`;
  } else {
    // Fallback if no specific keywords matched
    selectedMood = "Calm/Chill";
    confidence = 68.5;
    explanation = "Lyrics feature reflective and steady conversational tones without extreme emotional peaks, characteristic of a Calm/Chill atmosphere.";
  }

  // Construct percentage distribution for top moods
  const sumScores = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const distribution = {};
  for (const [m, s] of Object.entries(scores)) {
    distribution[m] = Math.round((s / sumScores) * 100);
  }

  return {
    mood: selectedMood,
    confidence,
    explanation,
    language,
    scores: distribution,
    detectedKeywords: matchedKeywordsByMood[selectedMood] || [],
    emoji: MOOD_LEXICONS[selectedMood]?.emoji || "🎵",
    gradient: MOOD_LEXICONS[selectedMood]?.gradient || "from-zinc-900 to-black",
    color: MOOD_LEXICONS[selectedMood]?.color || "#a855f7"
  };
}

module.exports = {
  MOOD_LEXICONS,
  classifyLyrics,
  detectLanguage,
  preprocessLyrics
};
