const express = require("express");
const { getIsConnected, memoryStore } = require("../db");
const Playlist = require("../models/Playlist");

const router = express.Router();

// GET /api/playlists
router.get("/", async (req, res, next) => {
  try {
    if (getIsConnected()) {
      let playlists = await Playlist.find().lean();
      if (!playlists || playlists.length === 0) {
        playlists = memoryStore.playlists;
      }
      return res.json({ success: true, playlists });
    } else {
      return res.json({ success: true, playlists: memoryStore.playlists });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/playlists/:mood
router.get("/:mood", async (req, res, next) => {
  try {
    const { mood } = req.params;
    let playlist = null;

    if (getIsConnected()) {
      playlist = await Playlist.findOne({ mood: new RegExp(`^${mood}$`, "i") }).lean();
    }
    
    if (!playlist) {
      playlist = memoryStore.playlists.find(
        p => p.mood.toLowerCase() === mood.toLowerCase()
      );
    }

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: `No curated playlist found for mood: ${mood}`
      });
    }

    return res.json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
