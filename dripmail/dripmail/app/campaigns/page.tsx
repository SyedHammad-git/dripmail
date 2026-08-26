"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import PageShell from "@/components/PageShell";
import "react-quill-new/dist/quill.snow.css"; // Updated Quill Editor CSS for React 19
import {
  Send,
  Mail,
  Lock,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Rocket,
  Pause,
  Play,
  Users,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import {
  CampaignFormData,
  CampaignStatus,
  DEFAULT_FORM_DATA,
  DEFAULT_STATUS,
} from "@/lib/types";

// Fixed dynamic import with .then((mod) => mod.default) to resolve Next.js default export component error for CJS modules
const ReactQuill = dynamic(
  () => import("react-quill-new").then((mod) => mod.default),
  { ssr: false }
);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function parseRecipients(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export default function CampaignsPage() {
  const [formData, setFormData] = useState<CampaignFormData>(DEFAULT_FORM_DATA);
  const [status, setStatus] = useState<CampaignStatus>(DEFAULT_STATUS);
  const [showPassword, setShowPassword] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recipientList = parseRecipients(formData.recipients);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(`${API_BASE}/status`);
        if (!res.ok) return;
        const data: CampaignStatus = await res.json();
        setStatus(data);
      } catch {
        // backend unreachable
      }
    }

    fetchStatus();
    pollRef.current = setInterval(fetchStatus, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  function updateField<K extends keyof CampaignFormData>(key: K, value: CampaignFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleStart() {
    setLaunchError(null);
    setIsLaunching(true);

    const client_list = parseRecipients(formData.recipients);

    const payload = {
      sender_email: formData.sender_email,
      app_password: formData.app_password,
      subject: formData.subject,
      body_html: formData.body_text, // Quill automatically outputs clean HTML including tables/lists
      min_delay: formData.min_delay,
      max_delay: formData.max_delay,
      client_list,
    };

    try {
      const res = await fetch(`${API_BASE}/start-campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }
      const statusRes = await fetch(`${API_BASE}/status`);
      if (statusRes.ok) {
        setStatus(await statusRes.json());
      }
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : "Failed to reach campaign server.");
    } finally {
      setIsLaunching(false);
    }
  }

  async function pauseCampaign() {
    setLaunchError(null);
    setIsPausing(true);
    try {
      const res = await fetch(`${API_BASE}/pause`, { method: "POST" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const statusRes = await fetch(`${API_BASE}/status`);
      if (statusRes.ok) setStatus(await statusRes.json());
    } catch (err) {
      setLaunchError("Failed to reach campaign server.");
    } finally {
      setIsPausing(false);
    }
  }

  async function resumeCampaign() {
    setLaunchError(null);
    setIsResuming(true);
    try {
      const res = await fetch(`${API_BASE}/resume`, { method: "POST" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const statusRes = await fetch(`${API_BASE}/status`);
      if (statusRes.ok) setStatus(await statusRes.json());
    } catch (err) {
      setLaunchError("Failed to reach campaign server.");
    } finally {
      setIsResuming(false);
    }
  }

  const progressPct = status.total_emails > 0
    ? Math.round(((status.successful_emails.length + status.failed_emails.length) / status.total_emails) * 100)
    : 0;

  const showLiveProgress = status.is_running;
  const showResults = !status.is_running && status.total_emails > 0;

  return (
    <PageShell>
      <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy tracking-tight">Create Campaign</h1>
            <p className="text-sm text-body">Design, configure and launch your email campaign</p>
          </div>
          {launchError && <p className="text-sm text-red-500 font-medium">{launchError}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            <Card>
              <SectionHeader number="01" title="Sender Credentials" subtitle="Authenticate your email provider" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email Address">
                  <InputWithIcon
                    icon={Mail}
                    type="email"
                    placeholder="yourname@example.com"
                    value={formData.sender_email}
                    onChange={(v) => updateField("sender_email", v)}
                  />
                </Field>
                <Field label="App Password">
                  <div className="flex items-center gap-2 border border-stroke rounded-lg px-3.5 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
                    <Lock className="w-4 h-4 text-muted shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.app_password}
                      onChange={(e) => updateField("app_password", e.target.value)}
                      placeholder="Enter app password"
                      className="w-full text-sm text-navy placeholder:text-muted outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-muted hover:text-body shrink-0"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary mt-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                We never store your password. It&apos;s used only to send emails securely.
              </div>
            </Card>

            <Card>
              <SectionHeader number="02" title="Message Details" subtitle="Compose your email content" />
              <Field label="Subject">
                <div className="flex items-center gap-2 border border-stroke rounded-lg px-3.5 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    placeholder="Exclusive offer for {{first_name}}"
                    className="w-full text-sm text-navy placeholder:text-muted outline-none bg-transparent"
                  />
                </div>
              </Field>

              <Field label="Body">
                <div className="bg-white rounded-lg border border-stroke overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-stroke [&_.ql-container]:border-none [&_.ql-editor]:min-h-[220px] [&_.ql-editor]:text-sm [&_.ql-editor]:text-navy focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition shadow-sm">
                  <ReactQuill
                    theme="snow"
                    value={formData.body_text}
                    onChange={(val) => updateField("body_text", val)}
                    placeholder="Compose your beautiful email here..."
                  />
                </div>
              </Field>
            </Card>

            <Card>
              <SectionHeader number="03" title="Target Audience" subtitle="Add your audience emails (one per line)" />
              <textarea
                rows={7}
                value={formData.recipients}
                onChange={(e) => updateField("recipients", e.target.value)}
                placeholder={"john@example.com\nsarah@example.com"}
                className="w-full text-sm text-navy leading-relaxed placeholder:text-muted border border-stroke rounded-lg px-3.5 py-3 outline-none resize-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition shadow-sm"
              />
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-2">
                <Users className="w-3.5 h-3.5" />
                {recipientList.length.toLocaleString()} {recipientList.length === 1 ? "email" : "emails"}
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            <Card>
              <SectionHeader icon={SlidersHorizontal} title="Campaign Control Center" subtitle="Set pacing, review and launch your campaign" />
              <div className="mb-5">
                <p className="text-sm font-semibold text-navy">Pacing</p>
                <p className="text-xs text-muted mb-3">Control email sending speed</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Min Delay (seconds)">
                    <NumberInput value={formData.min_delay} onChange={(v) => updateField("min_delay", v)} />
                  </Field>
                  <Field label="Max Delay (seconds)">
                    <NumberInput value={formData.max_delay} onChange={(v) => updateField("max_delay", v)} />
                  </Field>
                </div>
             <div className="flex flex-col gap-2">
  {!status?.is_running ? (
    <button onClick={handleStart} disabled={isLaunching} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg py-3 transition-colors shadow-sm">
      <Rocket className="w-4 h-4 text-white" />
      {isLaunching ? "Launching..." : "Launch Campaign"}
    </button>
  ) : status?.is_paused ? (
    <button onClick={resumeCampaign} disabled={isResuming} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg py-3 transition-colors shadow-sm">
      <Play className="w-4 h-4 text-white" />
      {isResuming ? "Resuming..." : "Resume Campaign"}
    </button>
  ) : (
    <button onClick={pauseCampaign} disabled={isPausing} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-slate-900 text-sm font-semibold rounded-lg py-3 transition-colors shadow-sm">
      <Pause className="w-4 h-4 text-slate-900" />
      {isPausing ? "Pausing..." : "Pause Campaign"}
    </button>
  )}
</div>
              </div>
            </Card>

            {showLiveProgress && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${status.is_paused ? "bg-muted" : "bg-green-500 animate-pulse"}`} />
                    <div>
                      <p className="text-sm font-semibold text-navy">Live Progress</p>
                      <p className="text-xs text-muted">{status.is_paused ? "Campaign is paused" : "Campaign is running"}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary">{progressPct}%</span>
                </div>
                <div className="w-full h-2 bg-tint rounded-full overflow-hidden mb-4">
                  <div className={`h-full rounded-full transition-all duration-500 ${status.is_paused ? "bg-muted" : "bg-primary"}`} style={{ width: `${progressPct}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <StatBox icon={Send} label="Sent" value={status.successful_emails.length} valueClass="text-primary" />
                  <StatBox icon={ShieldAlert} label="Failed" value={status.failed_emails.length} valueClass="text-red-500" />
                  <StatBox icon={Users} label="Total" value={status.total_emails} valueClass="text-navy" />
                </div>
                <div className="border border-stroke rounded-lg bg-tint px-3 py-2 h-[160px] overflow-y-auto font-mono text-[11px] text-body leading-relaxed shadow-inner">
                  {(status.log && status.log.length > 0 ? status.log : ["Waiting for log output..."]).map((line, i) => (
                    <div key={i} className="flex items-start gap-2 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {showResults && (
              <div className="grid grid-cols-2 gap-4">
                <ResultsCard variant="success" title="Successful Sends" count={status.successful_emails.length} items={status.successful_emails.map((email) => ({ label: email }))} />
                <ResultsCard variant="failed" title="Failed Sends" count={status.failed_emails.length} items={status.failed_emails.map((f) => ({ label: f.email, sub: f.error }))} />
              </div>
            )}
          </div>
        </div>
      </main>
    </PageShell>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border border-stroke rounded-2xl shadow-sm p-6">{children}</div>;
}

function SectionHeader({ number, icon: Icon, title, subtitle }: { number?: string; icon?: typeof SlidersHorizontal; title: string; subtitle: string; }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-tint flex items-center justify-center shrink-0 border border-stroke">
        {number ? <span className="text-sm font-bold text-primary">{number}</span> : Icon ? <Icon className="w-4.5 h-4.5 text-primary" /> : null}
      </div>
      <div>
        <p className="text-[15px] font-semibold text-navy">{title}</p>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-xs font-medium text-navy mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function InputWithIcon({ icon: Icon, type, placeholder, value, onChange }: { icon: typeof Mail; type: string; placeholder: string; value: string; onChange: (v: string) => void; }) {
  return (
    <div className="flex items-center gap-2 border border-stroke rounded-lg px-3.5 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
      <Icon className="w-4 h-4 text-muted shrink-0" />
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full text-sm text-navy placeholder:text-muted outline-none bg-transparent" />
    </div>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void; }) {
  return (
    <div className="flex items-center border border-stroke rounded-lg px-3.5 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full text-sm text-navy outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
      <ChevronDown className="w-3.5 h-3.5 text-muted" />
    </div>
  );
}

function StatBox({ icon: Icon, label, value, valueClass }: { icon: typeof Send; label: string; value: number; valueClass: string; }) {
  return (
    <div className="border border-stroke rounded-lg px-3 py-3 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted">{label}</span>
        <Icon className="w-3.5 h-3.5 text-muted" />
      </div>
      <p className={`text-xl font-bold ${valueClass}`}>{value.toLocaleString()}</p>
    </div>
  );
}

function ResultsCard({ variant, title, count, items }: { variant: "success" | "failed"; title: string; count: number; items: { label: string; sub?: string }[]; }) {
  const isSuccess = variant === "success";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stroke p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isSuccess ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <ShieldAlert className="w-4 h-4 text-red-500" />}
          <span className="text-sm font-semibold text-navy">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${isSuccess ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>{count}</span>
          <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80">View all<ArrowRight className="w-3 h-3" /></button>
        </div>
      </div>
      <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
        {items.length === 0 && <p className="text-xs text-muted">No entries yet.</p>}
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isSuccess ? "bg-green-500" : "bg-red-500"}`} />
            <div className="min-w-0">
              <p className="text-sm text-navy truncate">{item.label}</p>
              {item.sub && <p className="text-xs text-muted truncate">{item.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}