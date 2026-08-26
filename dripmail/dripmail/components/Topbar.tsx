"use client";

import { ChevronDown } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";

// Topbar spans the full width (no left sidebar in this layout — see
// mockup 2). It shows the DripMail wordmark on the left and the live
// Clerk session (avatar, name, email) on the right via useUser()/UserButton.
export default function Topbar() {
  const { user, isLoaded } = useUser();

  const displayName = isLoaded
    ? user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "Signed in"
    : "";
  const displayEmail = isLoaded ? user?.primaryEmailAddress?.emailAddress || "" : "";

  return (
    <header className="flex items-center justify-between h-[76px] px-6 md:px-10 bg-dm-header">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-white/25 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5">
            <path
              d="M21 4L2 12.5l7.5 2.5M21 4L15.5 21l-6-6M21 4L9.5 15.5"
              stroke="#0B1F4B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-lg font-bold text-dm-navy tracking-tight">DripMail</span>
      </div>

      <div className="flex items-center gap-5">
        {/* Notification bell removed completely as requested */}

        {isLoaded && user ? (
          <div className="relative flex items-center gap-2.5 cursor-pointer">
            {/* Visual Custom Layout (Avatar, Name, Email, Chevron) */}
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-white/40 shrink-0">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-dm-navy">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="hidden sm:block leading-tight text-left">
              <p className="text-sm font-semibold text-dm-navy truncate max-w-[160px]">
                {displayName}
              </p>
              <p className="text-xs text-dm-navy/70 truncate max-w-[160px]">
                {displayEmail}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-dm-navy/70 hidden sm:block" />

            {/* Absolute Transparent Clerk UserButton overlay covering the entire block */}
            <div className="absolute inset-0 opacity-0 overflow-hidden">
              <UserButton
                appearance={{
                  elements: {
                    rootBox: "w-full h-full",
                    userButtonBox: "w-full h-full",
                    userButtonTrigger: "w-full h-full cursor-pointer",
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/40 animate-pulse" />
            <div className="hidden sm:flex flex-col gap-1">
              <div className="w-24 h-3 rounded bg-white/40 animate-pulse" />
              <div className="w-32 h-2.5 rounded bg-white/30 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}