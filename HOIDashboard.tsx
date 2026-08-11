"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, Utensils, FileCheck2, RefreshCw } from "lucide-react";

type Summary = {
  totalStudents: number;
  presentStudents: number;
  staffPresent: number;
  staffTotal: number;
  mdmCount: number;
};

export default function HOIDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load dashboard");
      setSummary(await response.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const cards = [
    { label: "Total Roll Strength", value: summary?.totalStudents ?? "—", icon: Users },
    { label: "Students Present Today", value: summary?.presentStudents ?? "—", icon: UserCheck },
    { label: "Staff Present", value: summary ? `${summary.staffPresent}/${summary.staffTotal}` : "—", icon: UserCheck },
    { label: "Today's PM-POSHAN Count", value: summary?.mdmCount ?? "—", icon: Utensils }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-school-600">HOI MASTER DASHBOARD</p>
          <h2 className="text-2xl font-bold tracking-tight">Government Primary School Pethgam Wagoora</h2>
          <p className="mt-1 text-sm text-slate-500">Executive overview, attendance and scheme-readiness controls.</p>
        </div>
        <button onClick={() => void load()} className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-semibold shadow-sm">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>
              <Icon size={20} className="text-school-600" />
            </div>
            <div className="text-3xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="font-bold">UDISE Export Status</h3>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-800">
            <FileCheck2 size={22} />
            <div>
              <p className="font-semibold">Ready for validation</p>
              <p className="text-sm">Student roll and institutional metadata are available for export.</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="font-bold">Pre-seeded Personnel</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><b>HOI:</b> Mohammad Ashraf Rather</li>
            <li><b>Teachers:</b> Mohammad Iqbal Rather, Zamrooda Bano</li>
            <li><b>Aaya:</b> Masrat Begum</li>
            <li><b>Cook:</b> Shaheena Bano</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
