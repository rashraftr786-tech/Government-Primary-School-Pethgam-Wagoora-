"use client";

import { useMemo, useState } from "react";
import { Save, PackageOpen, Utensils } from "lucide-react";

const DEFAULTS = {
  ricePerChild: 100,
  pulsesPerChild: 20,
  oilPerChild: 5
};

export default function POSHANTracker() {
  const [headcount, setHeadcount] = useState(0);
  const [meals, setMeals] = useState(0);
  const [riceStock, setRiceStock] = useState(0);
  const [pulsesStock, setPulsesStock] = useState(0);
  const [oilStock, setOilStock] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const requirement = useMemo(() => ({
    rice: headcount * DEFAULTS.ricePerChild,
    pulses: headcount * DEFAULTS.pulsesPerChild,
    oil: headcount * DEFAULTS.oilPerChild
  }), [headcount]);

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/poshan/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString().slice(0, 10),
          attendanceHeadcount: headcount,
          mealsCooked: meals,
          riceGrams: requirement.rice,
          pulsesGrams: requirement.pulses,
          oilGrams: requirement.oil
        })
      });
      if (!response.ok) throw new Error("Unable to save meal log.");
      setMessage("Today's PM-POSHAN log saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-school-600">MODULE B</p>
        <h2 className="text-2xl font-bold">PM-POSHAN & Kitchen Management</h2>
        <p className="mt-1 text-sm text-slate-500">Designed for Cook Shaheena Bano and HOI oversight.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold"><Utensils size={19} /> Daily Meal Log</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">Morning attendance
              <input type="number" min="0" value={headcount} onChange={e => setHeadcount(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </label>
            <label className="text-sm font-medium">Meals cooked
              <input type="number" min="0" value={meals} onChange={e => setMeals(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </label>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <Quantity label="Rice" value={requirement.rice} />
            <Quantity label="Pulses" value={requirement.pulses} />
            <Quantity label="Oil" value={requirement.oil} />
          </div>

          <button onClick={() => void save()} disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-school-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            <Save size={17} /> {saving ? "Saving…" : "Save Meal Log"}
          </button>
          {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold"><PackageOpen size={19} /> Current Stock (kg)</h3>
          <p className="mt-1 text-xs text-slate-500">Use opening + incoming − consumption to maintain closing stock.</p>
          <div className="mt-4 space-y-3">
            <StockInput label="Rice" value={riceStock} onChange={setRiceStock} />
            <StockInput label="Pulses" value={pulsesStock} onChange={setPulsesStock} />
            <StockInput label="Oil" value={oilStock} onChange={setOilStock} />
          </div>
          <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm">
            <div className="font-semibold">Low-stock rule</div>
            <div className="mt-1 text-slate-600">Default warning threshold: 5 kg. Persist inventory entries through the API for auditability.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Quantity({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg bg-slate-50 p-3"><div className="text-xs text-slate-500">{label}</div><div className="font-bold">{value.toLocaleString()} g</div></div>;
}

function StockInput({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return <label className="block text-sm font-medium">{label}<input type="number" min="0" step="0.01" value={value} onChange={e => onChange(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>;
}
