"use client";

import { useState } from "react";
import ParallaxBackground from "@/components/ParallaxBackground";
import TopNavigation from "@/components/TopNavigation";
import HeroText from "@/components/HeroText";
import MusicPlayer from "@/components/MusicPlayer";
import PlaylistModal from "@/components/PlaylistModal";

export default function Home() {
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [isBhaktiMode, setIsBhaktiMode] = useState(false);
  const [flash, setFlash] = useState(false);

  const toggleBhaktiMode = () => {
    setFlash(true);
    setTimeout(() => {
      setIsBhaktiMode(!isBhaktiMode);
    }, 150); // change state mid-flash
    setTimeout(() => {
      setFlash(false);
    }, 600); // remove flash
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black selection:bg-white/20">
      {/* Full screen flash/pooch effect */}
      <div 
        className={`absolute inset-0 z-50 pointer-events-none bg-white transition-opacity duration-300 ${flash ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      <div className={`w-full h-full transition-transform duration-700 ${flash ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`}>
        <ParallaxBackground isBhaktiMode={isBhaktiMode} />
        <TopNavigation isBhaktiMode={isBhaktiMode} onToggleBhakti={toggleBhaktiMode} />
        <HeroText isBhaktiMode={isBhaktiMode} />
        
        <MusicPlayer 
          playlistOpen={playlistOpen} 
          onTogglePlaylist={() => setPlaylistOpen(!playlistOpen)} 
          isBhaktiMode={isBhaktiMode}
        />
        
        <PlaylistModal 
          isOpen={playlistOpen} 
          onClose={() => setPlaylistOpen(false)} 
        />
      </div>
    </main>
  );
}
