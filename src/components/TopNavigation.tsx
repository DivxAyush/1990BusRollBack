"use client";

import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";

export default function TopNavigation() {
  const [time, setTime] = useState("");

  const [mounted, setMounted] = useState(false);

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

  return (
    <nav className="absolute top-6 left-6 right-6 md:top-8 md:left-10 md:right-10 flex justify-between items-center z-10">
      {/* Time */}
      <div className="text-white/80 font-medium tracking-wide text-sm">
        {mounted ? time : ""}
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full bg-white/5 border-white/10">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        <span className="text-xs font-medium text-white/90">
          <span className="font-bold">1</span> on the highway
        </span>
      </div>

      {/* Right Icon */}
      <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer">
        <PlayCircle size={16} />
      </div>
    </nav>
  );
}
