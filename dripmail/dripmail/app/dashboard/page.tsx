import PageShell from "@/components/PageShell";
import { Send, Users, CheckCircle2, ShieldAlert } from "lucide-react";

const stats = [
  { label: "Total Campaigns", value: "24", icon: Send },
  { label: "Total Recipients", value: "48,210", icon: Users },
  { label: "Delivered", value: "46,982", icon: CheckCircle2 },
  { label: "Failed", value: "1,228", icon: ShieldAlert },
];

export default function DashboardPage() {
  return (
    <PageShell>
      <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dm-navy tracking-tight">Dashboard</h1>
          <p className="text-sm text-dm-body">Overview of your email marketing performance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white border border-dm-border rounded-card shadow-card p-5"
            >
              <div className="w-9 h-9 rounded-lg bg-dm-tint-light flex items-center justify-center mb-4">
                <Icon className="w-4.5 h-4.5 text-dm-primary" />
              </div>
              <p className="text-2xl font-bold text-dm-navy mb-0.5">{value}</p>
              <p className="text-xs text-dm-muted">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-dm-border rounded-card shadow-card p-6">
          <p className="text-sm font-semibold text-dm-navy mb-1">Recent Activity</p>
          <p className="text-xs text-dm-muted mb-6">
            Your latest campaign runs will appear here.
          </p>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-dm-tint-light flex items-center justify-center mb-3">
              <Send className="w-5 h-5 text-dm-primary" />
            </div>
            <p className="text-sm text-dm-body">No campaigns launched yet.</p>
            <p className="text-xs text-dm-muted mt-1">
              Head to Campaigns to send your first drip.
            </p>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
