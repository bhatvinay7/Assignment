"use client";

import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
      <div className="w-full min-h-screen h-auto">
        <SessionProvider>{children}</SessionProvider>
  </div>
  );
}
