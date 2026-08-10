"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ParallaxBackground({ isBhaktiMode }: { isBhaktiMode?: boolean }) {
 const bgRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
   if (!bgRef.current) return;
   
   // Disable parallax on mobile/tablet views (less than 1024px width)
   if (window.innerWidth < 1024) return;

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
     src={isBhaktiMode ? "/meditative_battlefield_natural_dull.webp" : "/bus_rear_seat_pov.webp"}
     alt="Background"
     fill
     priority
     sizes="100vw"
     className="object-cover object-center transition-opacity duration-700"
    />
    {/* Dark overlay to make background duller */}
    <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    {/* Subtle overlay gradient to make text more readable */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
   </div>
  </div>
 );
}
