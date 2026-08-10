"use client";

import { useState } from "react";
import ParallaxBackground from "@/components/ParallaxBackground";
import TopNavigation from "@/components/TopNavigation";
import HeroText from "@/components/HeroText";
import MusicPlayer from "@/components/MusicPlayer";
import PlaylistModal from "@/components/PlaylistModal";

export default function Home() {
  const [playlistOpen, setPlaylistOpen] = useState(false);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black selection:bg-white/20">
      <ParallaxBackground />
      <TopNavigation />
      <HeroText />
      
      <MusicPlayer 
        playlistOpen={playlistOpen} 
        onTogglePlaylist={() => setPlaylistOpen(!playlistOpen)} 
      />
      
      <PlaylistModal 
        isOpen={playlistOpen} 
        onClose={() => setPlaylistOpen(false)} 
      />
    </main>
  );
}
