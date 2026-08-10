"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ParallaxBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 20px translation
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      // 3D parallax effect on the background image
      bgRef.current.style.transform = `scale(1.05) translate(${-x}px, ${-y}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <div
        ref={bgRef}
        className="relative w-full h-full transition-transform duration-200 ease-out"
        style={{ transform: "scale(1.05)" }}
      >
        <Image
          src="/bus_rear_seat_pov.webp"
          alt="Vintage Bus Interior"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {/* Subtle overlay gradient to make text more readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
      </div>
    </div>
  );
}
