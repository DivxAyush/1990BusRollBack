"use client";

export default function HeroText({ isBhaktiMode }: { isBhaktiMode?: boolean }) {
  return (
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 w-full px-4 mt-8 transition-opacity duration-500">
      <h1 
        className="text-6xl md:text-8xl lg:text-[120px] font-bold text-glow font-hindi text-white mb-6 text-center"
        style={{ fontFamily: "var(--font-hindi)" }}
      >
        {isBhaktiMode ? "शिव सदा सहाय" : "बस वाले भैया"}
      </h1>
      
      {/* Optional subtext or quote if needed */}
      <div className="text-center mt-[15vh] transition-opacity duration-500">
        {isBhaktiMode ? (
          <p className="text-orange-200/90 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto text-shadow-sm">
            मेरी हर सांस में बसता है, तेरा ही नाम मेरे भोलेनाथ।
          </p>
        ) : (
          <>
            <p className="text-white/80 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto text-shadow-sm">
              मरना हो तो मरो अपने वतन की मिट्टी के लिए,
            </p>
            <p className="text-white/80 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto text-shadow-sm mt-1">
              हसीना भी दुपट्टा उतार देगी कफ़न के लिए। 
            </p>
          </>
        )}
      </div>
    </div>
  );
}
