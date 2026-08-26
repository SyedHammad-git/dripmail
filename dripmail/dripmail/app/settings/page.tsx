"use client";

import { useUser } from "@clerk/nextjs";
import PageShell from "@/components/PageShell";
import { User, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();

  const fullName = isLoaded ? user?.fullName || "" : "";
  const email = isLoaded ? user?.primaryEmailAddress?.emailAddress || "" : "";

  return (
    <PageShell>
      <main className="flex-1 p-8 max-w-2xl w-full mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-dm-navy tracking-tight">Settings</h1>
          <p className="text-sm text-dm-body">Manage your account and preferences.</p>
        </div>

        <div className="bg-white border border-dm-border rounded-card shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-dm-tint-light flex items-center justify-center">
              <User className="w-4.5 h-4.5 text-dm-primary" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-dm-navy">PROFILE</p>
              <p className="text-xs text-dm-muted">Update your personal details.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-wide text-dm-muted mb-1.5">
                FULL NAME
              </label>
              <input
                defaultValue={fullName}
                className="w-full text-sm text-dm-navy border border-dm-border rounded-field px-3.5 py-2.5 outline-none focus:border-dm-primary focus:ring-2 focus:ring-dm-primary/10 transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-wide text-dm-muted mb-1.5">
                EMAIL
              </label>
              <input
                defaultValue={email}
                disabled
                className="w-full text-sm text-dm-navy border border-dm-border rounded-field px-3.5 py-2.5 outline-none bg-dm-tint-light/50 cursor-not-allowed"
              />
            </div>
          </div>

          <button className="mt-5 bg-dm-primary hover:bg-dm-primary/90 text-white text-sm font-semibold rounded-field px-4 py-2.5 transition-colors">
            Save Changes
          </button>
        </div>

        <div className="bg-white border border-dm-border rounded-card shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-dm-tint-light flex items-center justify-center">
              <Bell className="w-4.5 h-4.5 text-dm-primary" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-dm-navy">NOTIFICATIONS</p>
              <p className="text-xs text-dm-muted">Choose what you&apos;re notified about.</p>
            </div>
          </div>

          {["Campaign completed", "Campaign failed", "Weekly summary"].map((label) => (
            <label
              key={label}
              className="flex items-center justify-between py-3 border-b border-dm-border last:border-b-0"
            >
              <span className="text-sm text-dm-body">{label}</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-dm-primary"
              />
            </label>
          ))}
        </div>

        <div className="bg-white border border-dm-border rounded-card shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-dm-tint-light flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-dm-primary" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-dm-navy">SECURITY</p>
              <p className="text-xs text-dm-muted">Password and account access.</p>
            </div>
          </div>
          <button className="text-sm font-medium text-dm-primary hover:text-dm-primary/80">
            Change password →
          </button>
        </div>
      </main>
    </PageShell>
  );
}
