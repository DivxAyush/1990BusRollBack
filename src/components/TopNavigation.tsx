"use client";

import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TopNavigation({ isBhaktiMode, onToggleBhakti }: { isBhaktiMode?: boolean, onToggleBhakti?: () => void }) {
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(1);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // If Supabase is not configured (missing keys), we just fallback to showing 1.
    if (!supabase) return;

    // Create a random user key for this session
    const userKey = 'user_' + Math.random().toString(36).substring(2, 9);
    const channel = supabase.channel('public-bus-room', {
      config: { presence: { key: userKey } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        setOnlineUsers(Math.max(1, count));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  return (
    <nav className="absolute top-3 left-4 right-4 md:top-4 md:left-8 md:right-8 flex justify-between items-start z-10">
      {/* Time */}
      <div className="text-white/80 font-medium tracking-wide text-sm mt-2">
        {mounted ? time : ""}
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2.5 glass-panel py-1.5 md:py-2 rounded-full bg-white/5 border-white/10 mt-2" style={{ paddingLeft: '9px', paddingRight: '10px', paddingBottom: '5px', paddingTop: '5px' }}>
        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
        <span className="text-[11px] md:text-xs font-medium text-white/90">
          <span className="font-bold">{onlineUsers}</span> {onlineUsers === 1 ? 'Passenger is listening' : 'Passengers are listening'}
        </span>
      </div>

      {/* Bhakti Toggle Button */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={onToggleBhakti}
          className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isBhaktiMode ? 'bg-orange-500/30 border-orange-400/50 text-orange-200' : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white'}`}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: isBhaktiMode ? '0 4px 20px rgba(249, 115, 22, 0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          {isBhaktiMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>
          )}
        </button>
        <span className={`text-[10px] font-semibold tracking-wide ${isBhaktiMode ? 'text-orange-300' : 'text-white/70'}`}>
          {isBhaktiMode ? 'Bhakti On' : 'Turn into Bhakti'}
        </span>
      </div>
    </nav>
  );
}
