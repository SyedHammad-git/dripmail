"use client";

import { Send, Zap, BarChart3, Users, Shield, Clock, Headphones } from "lucide-react";

const features = [
  {
    icon: Send,
    title: "Easy Campaigns",
    copy: "Create and launch campaigns in just a few steps.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    copy: "Track opens, clicks and replies in real-time.",
  },
  {
    icon: Users,
    title: "Target the Right Audience",
    copy: "Segment your audience and send personalized emails.",
  },
];

const footerStrip = [
  { icon: Shield, title: "Secure & Reliable", copy: "Your data is safe and encrypted." },
  { icon: Clock, title: "Save Time", copy: "Automate your emails and save hours." },
  { icon: Zap, title: "Boost Engagement", copy: "Send the right message to the right people." },
  { icon: Headphones, title: "24/7 Support", copy: "We're here to help you anytime." },
];

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-surface flex flex-col">
      <div className="flex-1 grid lg:grid-cols-[1fr_1fr] gap-8 max-w-[1600px] w-full mx-auto px-6 lg:px-16 py-12 items-center">
        {/* Left: brand / marketing panel */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Send className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-2xl font-bold text-navy tracking-tight">DripMail</span>
          </div>

          <h1 className="text-[2.75rem] leading-[1.15] font-bold text-navy mb-4 tracking-tight">
            Smart Email Campaigns,
            <br />
            <span className="text-primary">Better Results.</span>
          </h1>
          <p className="text-body text-[15px] leading-relaxed max-w-md mb-10">
            Create, automate and track your email campaigns with ease. Reach
            the right audience at the right time.
          </p>

          <div className="flex flex-col gap-6">
            {features.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-stroke">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy mb-0.5">{title}</p>
                  <p className="text-sm text-body leading-relaxed">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: auth card wrapper (Sirf wrapper hai, extra white box nahi) */}
        <div className="flex justify-center lg:justify-end w-full">
          <div className="w-full max-w-[420px]">
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Send className="w-4 h-4 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-xl font-bold text-navy tracking-tight">DripMail</span>
            </div>
            {/* Yahan Clerk ka apna card aayega */}
            {children}
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-stroke bg-white/60">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-16 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {footerStrip.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-tint flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy">{title}</p>
                <p className="text-xs text-muted leading-relaxed">{copy}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted pb-6">
          © 2026 DripMail. All rights reserved.
        </p>
      </div>
    </div>
  );
}