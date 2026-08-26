import Topbar from "@/components/Topbar";

// Topbar-only layout — no left sidebar (see mockup 2). Every authenticated
// page renders inside this shell.
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-dm-bg">
      <Topbar />
      {children}
    </div>
  );
}
