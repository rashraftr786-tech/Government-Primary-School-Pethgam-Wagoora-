"use client";

import { useState } from "react";
import HOIDashboard from "@/components/HOIDashboard";
import RollUploader from "@/components/RollUploader";
import POSHANTracker from "@/components/POSHANTracker";
import { LayoutDashboard, Upload, Utensils, ShieldCheck } from "lucide-react";

type Tab = "dashboard" | "students" | "poshan";

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-base font-bold text-slate-900">PS Pethgam Wagoora ERP</h1>
            <p className="text-xs text-slate-500">UDISE: 01022202207</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-school-50 px-3 py-1.5 text-xs font-semibold text-school-700">
            <ShieldCheck size={15} /> HOI_ADMIN
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2">
          <NavButton active={tab === "dashboard"} onClick={() => setTab("dashboard")} icon={<LayoutDashboard size={17} />}>Dashboard</NavButton>
          <NavButton active={tab === "students"} onClick={() => setTab("students")} icon={<Upload size={17} />}>Student Roll</NavButton>
          <NavButton active={tab === "poshan"} onClick={() => setTab("poshan")} icon={<Utensils size={17} />}>PM-POSHAN</NavButton>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-5">
        {tab === "dashboard" && <HOIDashboard />}
        {tab === "students" && <RollUploader />}
        {tab === "poshan" && <POSHANTracker />}
      </section>
    </main>
  );
}

function NavButton({ active, onClick, icon, children }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-school-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
      {icon}{children}
    </button>
  );
}
