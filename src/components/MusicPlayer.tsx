"use client";

import { useState, useEffect } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import Image from "next/image";

export const PLAYLIST_SONGS = [
 { id: 1, title: "Tumse Milne Ko Dil Karta Hai", artist: "Alka Yagnik, Kumar Sanu" },
 { id: 2, title: "Tumhein Dekhen Meri Aankhen", artist: "Alka Yagnik, Kumar Sanu" },
 { id: 3, title: "Barsaat Ke Mausam Mein", artist: "Kumar Sanu, Roop Kumar Rathod" },
 { id: 4, title: "Dil Hai Ki Manta Nahin", artist: "Anuradha Paudwal, Kumar Sanu" },
 { id: 5, title: "Woh Meri Neend Mera Chain", artist: "Sadhana Sargam" },
 { id: 6, title: "Tumhein Apna Banane Ki Kasam", artist: "Anuradha Paudwal, Kumar Sanu" },
 { id: 7, title: "Pehli Pehli Baar Mohabbat Ki Hai", artist: "Kumar Sanu, Alka Yagnik" }
];

interface MusicPlayerProps {
 onTogglePlaylist?: () => void;
 playlistOpen?: boolean;
}

export default function MusicPlayer({ onTogglePlaylist, playlistOpen }: MusicPlayerProps) {
 const [player, setPlayer] = useState<YouTubePlayer | null>(null);
 const [isPlaying, setIsPlaying] = useState(false);
 const [currentTime, setCurrentTime] = useState(0);
 const [duration, setDuration] = useState(0);
 const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
 const [isDragging, setIsDragging] = useState(false);

 // Poll for time updates
 useEffect(() => {
  let interval: NodeJS.Timeout;
  if (isPlaying && player && !isDragging) {
   interval = setInterval(() => {
    try {
     const time = player.getCurrentTime();
     setCurrentTime(time || 0);

     if (duration === 0) {
      const dur = player.getDuration();
      setDuration(dur || 0);
     }
    } catch (e) {
     // ignore
    }
   }, 500); // Polling faster for smoother progress
  }
  return () => clearInterval(interval);
 }, [isPlaying, player, duration, isDragging]);

 const formatTime = (timeInSeconds: number) => {
  const m = Math.floor(timeInSeconds / 60);
  const s = Math.floor(timeInSeconds % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
 };

 const onReady = (event: YouTubeEvent) => {
  setPlayer(event.target);
 };

 const onStateChange = (event: YouTubeEvent) => {
  if (event.data === 1) { // Playing
   setIsPlaying(true);
   setDuration(event.target.getDuration());

   const idx = event.target.getPlaylistIndex();
   if (idx !== undefined && idx !== null) {
    setCurrentTrackIndex(idx);
   }
  } else if (event.data === 2 || event.data === 0) {
   setIsPlaying(false);
  }
 };

 const togglePlay = () => {
  if (!player) return;
  isPlaying ? player.pauseVideo() : player.playVideo();
 };

 const nextTrack = () => player?.nextVideo();
 const prevTrack = () => player?.previousVideo();

 const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setIsDragging(true);
  setCurrentTime(Number(e.target.value));
 };

 const handleSeekEnd = () => {
  setIsDragging(false);
  if (player) {
   player.seekTo(currentTime, true);
  }
 };

 const currentSong = PLAYLIST_SONGS[currentTrackIndex % PLAYLIST_SONGS.length];

 return (
  <>
   <div className="hidden">
    <YouTube
     videoId=""
     opts={{
      height: '0',
      width: '0',
      playerVars: {
       listType: 'playlist',
       list: 'PLeatb7hupNV_AWUl_7ttbsKeCQh8tF5N4',
       autoplay: 0,
       controls: 0,
       disablekb: 1,
      },
     }}
     onReady={onReady}
     onStateChange={onStateChange}
    />
   </div>

   <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-[600px] z-20">
    {/* The Pill Shaped Player */}
    <div className="flex items-center rounded-full bg-white/10 backdrop-blur-[20px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden pr-3 md:pr-6 h-[70px] md:h-[90px] border border-white/20">

     {/* Left: Album Art */}
     <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] shrink-0 ml-4 md:ml-5 mr-2 md:mr-3">
      <div className={`relative w-full h-full rounded-full overflow-hidden shadow-lg border border-white/30 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
       <Image
        src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=100&w=600&auto=format&fit=crop"
        alt="Album Art"
        fill
        sizes="100px"
        className="object-cover"
       />
       <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3.5 h-3.5 bg-[#111] rounded-full border border-gray-600/50"></div>
       </div>
      </div>
     </div>

     {/* Middle: Info & Progress */}
     <div className="flex-1 min-w-0 pl-1 pr-2 md:pl-2 md:pr-4 flex flex-col justify-center">
      <h3 className="text-white font-semibold text-sm md:text-base leading-tight truncate">{currentSong?.title || "Loading..."}</h3>
      <p className="text-white/70 text-[10px] md:text-xs mb-1 md:mb-2 truncate">{currentSong?.artist || "YouTube Music"}</p>

      {/* Custom Progress Bar */}
      <div className="relative flex-1 h-1.5 flex items-center group cursor-pointer w-full mb-1.5">
       <input
        type="range"
        min="0"
        max={duration || 100}
        value={currentTime}
        onChange={handleSeekChange}
        onMouseUp={handleSeekEnd}
        onTouchEnd={handleSeekEnd}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
       />
       {/* Track */}
       <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
        <div
         className="h-full bg-white rounded-full relative"
         style={{
          width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
          transition: isDragging ? 'none' : 'width 0.5s linear'
         }}
        />
       </div>
       {/* Custom Thumb */}
       <div
        className="absolute h-2.5 w-2.5 bg-white rounded-full shadow opacity-100 transition-opacity pointer-events-none"
        style={{
         left: `calc(${duration > 0 ? (currentTime / duration) * 100 : 0}% - 5px)`,
         transition: isDragging ? 'none' : 'left 0.5s linear'
        }}
       />
      </div>

      <div className="text-white/60 text-[9px] md:text-[11px] font-medium tracking-wide">
       {formatTime(currentTime)} / {formatTime(duration)}
      </div>
     </div>

     {/* Right: Controls */}
     <div className="flex items-center gap-3 md:gap-6 shrink-0 mr-4 md:mr-6">
      <button onClick={prevTrack} className="text-white/80 hover:text-white transition-colors">
       <SkipBack className="fill-current w-4 h-4 md:w-5 md:h-5" />
      </button>

      <button
       onClick={togglePlay}
       className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform shadow-lg shrink-0"
      >
       {isPlaying ? <Pause className="fill-black w-5 h-5 md:w-6 md:h-6" /> : <Play className="fill-black w-5 h-5 md:w-6 md:h-6 ml-1" />}
      </button>

      <button onClick={nextTrack} className="text-white/80 hover:text-white transition-colors">
       <SkipForward className="fill-current w-4 h-4 md:w-5 md:h-5" />
      </button>
     </div>

    </div>
   </div>
  </>
 );
}
