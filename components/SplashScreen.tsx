"use client";

import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"logo" | "text" | "fade">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 600);
    const t2 = setTimeout(() => setPhase("fade"), 2000);
    const t3 = setTimeout(() => onFinish(), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        opacity: phase === "fade" ? 0 : 1,
        transition: "opacity 0.6s ease-out",
      }}
    >
      {/* Background: white with red gradient sweep from top-right */}
      <div className="absolute inset-0 bg-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 80% 0%, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.08) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 100%, rgba(239,68,68,0.10) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Center Content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Book Icon */}
        <div
          style={{
            transform:
              phase === "logo"
                ? "scale(0.4) rotate(-10deg)"
                : "scale(1) rotate(0deg)",
            opacity: phase === "logo" ? 0 : 1,
            transition:
              "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease",
          }}
        >
          <div className="relative w-24 h-24">
            {/* Book shadow */}
            <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl translate-y-4 scale-90" />
            {/* Book container */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl">
              {/* Book pages animation */}
              <div className="relative w-12 h-14">
                {/* Left page */}
                <div
                  className="absolute left-0 top-0 w-5 h-14 bg-white rounded-l-sm origin-right"
                  style={{
                    transform:
                      phase === "text" ? "rotateY(0deg)" : "rotateY(-25deg)",
                    transition: "transform 0.5s ease 0.3s",
                  }}
                />
                {/* Spine */}
                <div className="absolute left-[18px] top-0 w-1 h-14 bg-red-300 z-10" />
                {/* Right page */}
                <div
                  className="absolute right-0 top-0 w-5 h-14 bg-white/90 rounded-r-sm origin-left"
                  style={{
                    transform:
                      phase === "text" ? "rotateY(0deg)" : "rotateY(25deg)",
                    transition: "transform 0.5s ease 0.3s",
                  }}
                />
                {/* Page lines */}
                <div className="absolute left-1 top-3 right-auto w-4 space-y-1.5 z-10">
                  <div className="h-0.5 bg-red-200 rounded" />
                  <div className="h-0.5 bg-red-200 rounded w-3" />
                  <div className="h-0.5 bg-red-200 rounded" />
                  <div className="h-0.5 bg-red-200 rounded w-2.5" />
                </div>
                <div className="absolute right-1 top-3 left-auto w-4 space-y-1.5 z-10">
                  <div className="h-0.5 bg-red-200/70 rounded" />
                  <div className="h-0.5 bg-red-200/70 rounded w-3" />
                  <div className="h-0.5 bg-red-200/70 rounded" />
                  <div className="h-0.5 bg-red-200/70 rounded w-2.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div
          style={{
            opacity: phase === "text" ? 1 : 0,
            transform: phase === "text" ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
          }}
          className="text-center"
        >
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #111827 0%, #ef4444 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            StudyMate
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium tracking-widest uppercase">
            Organize · Summarize · Excel
          </p>
        </div>

        {/* Loading dot pulse */}
        <div
          style={{
            opacity: phase === "text" ? 1 : 0,
            transition: "opacity 0.4s ease 0.5s",
          }}
          className="flex gap-1.5 mt-2"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-red-400"
              style={{
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
