const mongoose = require("mongoose");

const SongItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: String, default: "3:30" }
});

const PlaylistSchema = new mongoose.Schema(
  {
    mood: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "Happy",
        "Sad",
        "Angry",
        "Romantic",
        "Calm/Chill",
        "Exciting",
        "Patriotic",
        "Thrilling",
        "Horror"
      ]
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    songs: [SongItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", PlaylistSchema);
