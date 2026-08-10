"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in a real app
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Dimmed Background to keep the vibe */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="w-full h-full bg-[url('/bus_rear_seat_pov.webp')] bg-cover bg-center grayscale blur-sm" />
      </div>

      <div className="z-10 flex flex-col items-center text-center glass-panel p-8 max-w-lg mx-4 bg-black/60 border-red-500/20">
        <h2 className="text-4xl font-bold font-hindi text-red-400 mb-4 text-glow">
          बस खराब हो गई
        </h2>
        <p className="text-white/70 mb-8 text-lg">
          Looks like the engine broke down (Something went wrong). Don't worry, the mechanic is on the way!
        </p>
        
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all hover:scale-105"
        >
          Try Restarting Engine
        </button>
      </div>
    </div>
  );
}
