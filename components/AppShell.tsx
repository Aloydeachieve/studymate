"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
      <div
        style={{
          opacity: splashDone ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: splashDone ? "auto" : "none",
        }}
      >
        {children}
      </div>
    </>
  );
}
