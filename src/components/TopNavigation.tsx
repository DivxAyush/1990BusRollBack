"use client";

import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TopNavigation() {
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
    <nav className="absolute top-6 left-6 right-6 md:top-8 md:left-10 md:right-10 flex justify-between items-center z-10">
      {/* Time */}
      <div className="text-white/80 font-medium tracking-wide text-sm">
        {mounted ? time : ""}
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2.5 glass-panel px-5 md:px-6 py-1.5 md:py-2 rounded-full bg-white/5 border-white/10">
        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
        <span className="text-[11px] md:text-xs font-medium text-white/90">
          <span className="font-bold">{onlineUsers}</span> {onlineUsers === 1 ? 'Passenger is listening' : 'Passengers are listening'}
        </span>
      </div>

      {/* Right Icon */}
      <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer">
        <PlayCircle size={16} />
      </div>
    </nav>
  );
}
