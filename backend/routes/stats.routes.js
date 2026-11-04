const express = require("express");
const { getIsConnected, memoryStore } = require("../db");
const Analysis = require("../models/Analysis");

const router = express.Router();

/**
 * GET /api/stats
 * Aggregates statistics based on EmoLyrics research paper benchmarks & real analysis runs
 */
router.get("/", async (req, res, next) => {
  try {
    let analyses = [];
    if (getIsConnected()) {
      analyses = await Analysis.find().lean();
    } else {
      analyses = memoryStore.analyses;
    }

    const totalAnalyses = 1420 + analyses.length; // Baseline benchmark count + active
    const moodCounts = {
      Happy: 340,
      Sad: 290,
      Romantic: 260,
      "Calm/Chill": 180,
      Exciting: 140,
      Patriotic: 75,
      Angry: 65,
      Thrilling: 45,
      Horror: 25
    };

    // Add active runs to mood counts
    for (const a of analyses) {
      if (moodCounts[a.mood] !== undefined) {
        moodCounts[a.mood] += 1;
      }
    }

    const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / totalAnalyses) * 100)
    }));

    return res.json({
      success: true,
      stats: {
        totalAnalyses,
        genreConsistency: "89%", // From EmoLyrics.pdf Slide 12
        languageAccuracy: "87%", // From EmoLyrics.pdf Slide 12
        supportedMoods: 9,
        supportedLanguages: ["English", "Hindi (Devanagari)", "Hindi (Hinglish)"],
        moodDistribution,
        researchTeam: [
          { name: "Chandrima Chawdhury", id: "359", role: "Team Lead & NLP Architect" },
          { name: "Harshit Raj", id: "403", role: "Model Training & Feature Extraction" },
          { name: "Sristi Priya", id: "399", role: "Frontend UI/UX & Interaction" },
          { name: "Dibyendu Khamaru", id: "412", role: "Dataset Curation & Evaluation" },
          { name: "Tribeni Ghorai", id: "455", role: "System Architecture & Integration" }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
