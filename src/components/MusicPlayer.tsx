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
    isBhaktiMode?: boolean;
}

export default function MusicPlayer({ onTogglePlaylist, playlistOpen, isBhaktiMode }: MusicPlayerProps) {
    const [player, setPlayer] = useState<YouTubePlayer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [videoId, setVideoId] = useState<string>('');
    const [videoTitle, setVideoTitle] = useState<string>('');
    const [videoAuthor, setVideoAuthor] = useState<string>('');

    // Reset state when mode changes to prevent stale data
    useEffect(() => {
        setVideoId('');
        setVideoTitle('');
        setVideoAuthor('');
        setCurrentTime(0);
        setDuration(0);
        setCurrentTrackIndex(0);
    }, [isBhaktiMode]);

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
        // Autoplay when mode changes so the correct playlist starts immediately
        event.target.playVideo();
    };

    const onStateChange = (event: YouTubeEvent) => {
        if (event.data === 1) { // Playing
            setIsPlaying(true);
            setDuration(event.target.getDuration());

            const idx = event.target.getPlaylistIndex();
            if (idx !== undefined && idx !== null) {
                setCurrentTrackIndex(idx);
            }

            // Get current video ID and info for thumbnail & title
            try {
                const data = event.target.getVideoData();
                if (data?.video_id) setVideoId(data.video_id);
                if (data?.title) setVideoTitle(data.title);
                if (data?.author) setVideoAuthor(data.author);
            } catch (e) { /* ignore */ }
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

    // Use dynamic YouTube data if available, otherwise fallback to playlist array
    const currentSong = videoTitle 
        ? { title: videoTitle, artist: videoAuthor } 
        : PLAYLIST_SONGS[currentTrackIndex % PLAYLIST_SONGS.length];

    return (
        <>
            <div className="hidden">
                <YouTube
                    key={isBhaktiMode ? "bhakti-mode" : "normal-mode"}
                    videoId=""
                    opts={{
                        height: '0',
                        width: '0',
                        playerVars: {
                            listType: 'playlist',
                            list: isBhaktiMode ? 'PLTJj9m7vJ9ys' : 'PLeatb7hupNV_AWUl_7ttbsKeCQh8tF5N4',
                            autoplay: 0,
                            controls: 0,
                            disablekb: 1,
                        },
                    }}
                    onReady={onReady}
                    onStateChange={onStateChange}
                />
            </div>

            {/* Player Wrapper */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[85%] sm:w-[75%] md:w-[70%] max-w-[520px]">
                {/* Pill Player */}
                <div className="flex items-center rounded-full border border-white/20 h-[72px] md:h-[88px] gap-3 md:gap-4"
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                        boxSizing: 'border-box',
                    }}
                >
                    {/* Left: Album Art */}
                    <div className="w-[46px] h-[46px] md:w-[56px] md:h-[56px] shrink-0">
                        <div
                            className={`relative w-full h-full rounded-full overflow-hidden ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
                            style={{ border: '2px solid rgba(255,255,255,0.35)', boxShadow: '0 0 12px rgba(0,0,0,0.5)' }}
                        >
                            <Image
                                src={videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/album_art.png'}
                                alt="Album Art"
                                fill
                                sizes="60px"
                                className="object-cover scale-[1.35]"
                            />
                            {/* Vinyl center hole */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full" style={{ background: '#111', border: '1px solid rgba(150,150,150,0.4)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Middle: Song Info & Progress */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                        <h3 className="text-white font-semibold text-[12px] md:text-[14px] leading-tight truncate m-0">
                            {currentSong?.title || "Loading..."}
                        </h3>
                        <p className="text-white/65 text-[10px] md:text-[11px] truncate m-0">
                            {currentSong?.artist || "YouTube Music"}
                        </p>

                        {/* Progress Bar */}
                        <div className="relative flex items-center mt-1.5" style={{ height: '6px', cursor: 'pointer', width: '92%' }}>
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
                            <div className="w-full rounded-full overflow-hidden" style={{ height: '2px', background: 'rgba(255,255,255,0.25)' }}>
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        background: '#fff',
                                        width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                                        transition: isDragging ? 'none' : 'width 0.5s linear'
                                    }}
                                />
                            </div>
                            <div
                                className="absolute rounded-full pointer-events-none"
                                style={{
                                    width: '6px', height: '6px',
                                    background: '#fff',
                                    boxShadow: '0 0 4px rgba(0,0,0,0.4)',
                                    left: `calc(${duration > 0 ? (currentTime / duration) * 100 : 0}% - 3px)`,
                                    transition: isDragging ? 'none' : 'left 0.5s linear'
                                }}
                            />
                        </div>

                        <div className="text-[9px] md:text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 pr-3 pl-1">
                        <button
                            onClick={prevTrack}
                            className="hover:scale-125 active:scale-95 transition-transform duration-150 flex items-center p-1"
                            style={{ color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <SkipBack className="fill-current w-[15px] h-[15px] sm:w-[17px] sm:h-[17px]" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="hover:scale-110 active:scale-95 transition-transform duration-150 flex items-center justify-center rounded-full shrink-0"
                            style={{
                                width: '38px', height: '38px',
                                background: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                            }}
                        >
                            {isPlaying
                                ? <Pause className="fill-black w-[17px] h-[17px]" />
                                : <Play className="fill-black w-[17px] h-[17px] ml-0.5" />
                            }
                        </button>

                        <button
                            onClick={nextTrack}
                            className="hover:scale-125 active:scale-95 transition-transform duration-150 flex items-center p-1"
                            style={{ color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <SkipForward className="fill-current w-[15px] h-[15px] sm:w-[17px] sm:h-[17px]" />
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
