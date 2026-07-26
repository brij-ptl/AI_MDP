"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import { dashboardService } from "@/services/dashboard.service";
import { DISEASES } from "@/constants/diseases";

type RiskPoint = { date: string; disease_slug: string; probability: number; risk_level: string };

export default function AnalyticsPage() {
  const [disease, setDisease] = useState("");
  const [data, setData] = useState<RiskPoint[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { dashboardService.riskTrend(disease || undefined).then((response: any) => setData(response.data ?? [])).catch((err) => setError(err instanceof Error ? err.message : "Failed to load risk trend.")); }, [disease]);
  const chartData = data.map((item) => ({ ...item, date: new Date(item.date).toLocaleDateString(), risk: Math.round(item.probability * 100) }));

  return <><DashboardTopbar title="Health Analytics" /><div className="p-6 lg:p-10"><div className="rounded-2xl border border-border bg-surface p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">Average risk score trend</h3><select value={disease} onChange={(event) => setDisease(event.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm"><option value="">All diseases</option>{DISEASES.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></div>{error ? <p className="text-sm text-red-500">{error}</p> : <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" /><XAxis dataKey="date" stroke="rgb(var(--color-muted))" /><YAxis stroke="rgb(var(--color-muted))" /><Tooltip contentStyle={{ background: "rgb(var(--color-surface))", border: "1px solid rgb(var(--color-border))" }} /><Line type="monotone" dataKey="risk" stroke="rgb(var(--color-primary))" strokeWidth={2} /></LineChart></ResponsiveContainer></div>}<p className="mt-4 text-sm text-muted">Run predictions regularly to build your personal risk trendline.</p></div></div></>;
}
