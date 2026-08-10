"use client";

import { PLAYLIST_SONGS } from "./MusicPlayer";
import { X, Music } from "lucide-react";

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlaylistModal({ isOpen, onClose }: PlaylistModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div 
        className="glass-panel w-full max-w-md max-h-[70vh] flex flex-col rounded-3xl bg-black/60 border-white/10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Music size={20} className="text-white/80" />
            Up Next
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Playlist Tracks */}
        <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
          {PLAYLIST_SONGS.map((song, index) => (
            <div 
              key={song.id} 
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="text-white/40 font-mono text-sm w-4 group-hover:text-white transition-colors">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white/90 font-medium text-sm truncate group-hover:text-white transition-colors">
                  {song.title}
                </h4>
                <p className="text-white/50 text-xs truncate mt-0.5">
                  {song.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
