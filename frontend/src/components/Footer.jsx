import { Heart, ExternalLink, Music2, Code2 } from "lucide-react";

export default function Footer({ onOpenResearch }) {
  return (
    <footer className="border-t border-white/10 bg-neutral-950/90 text-neutral-400 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
            <Music2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-white font-display font-semibold text-base">EmoLyrics</div>
            <div className="text-xs text-neutral-500">Song Lyrics Mood Classification System • Larana, Inc.</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <button onClick={onOpenResearch} className="hover:text-white transition-colors">
            Research Architecture
          </button>
          <a
            href="https://share.google/4KtdJSaRmEiQjCvHD"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            IIIT Hyderabad Dataset <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/Chandrima2507/SONG_LYRICS_EMOTION_CLASSIFICATION07"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            GitHub Project <Code2 className="w-3 h-3" />
          </a>
        </div>

        <div className="text-xs text-neutral-500 flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Chandrima & Team
        </div>
      </div>
    </footer>
  );
}
