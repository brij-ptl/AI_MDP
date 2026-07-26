"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";

type PlatformAnalytics = {
  total_users: number;
  total_predictions: number;
  total_revenue_inr: number;
  active_subscriptions: number;
  predictions_by_disease: Record<string, number>;
  signups_last_30_days: Array<{ date: string; signups: number }>;
};

export default function AnalyticsAdminPage() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService.platformAnalytics()
      .then((response: any) => setAnalytics(response.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load platform analytics."));
  }, []);

  return <div>
    <h1 className="font-display text-2xl font-bold">Prediction Analytics</h1>
    <p className="mt-2 text-sm text-muted">Aggregate usage, revenue, and sign-up analytics across modules.</p>
    {error ? <div className="mt-6 rounded-2xl border border-red-500/30 bg-surface p-8 text-sm text-red-500">{error}</div>
      : !analytics ? <div className="mt-6 rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">Loading analytics...</div>
        : <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[["Total users", analytics.total_users], ["Predictions", analytics.total_predictions], ["Active subscriptions", analytics.active_subscriptions], ["Revenue", `₹${analytics.total_revenue_inr}`]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-border bg-surface p-5"><p className="text-xs text-muted">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6"><h2 className="font-semibold">Predictions by disease</h2><div className="mt-4 grid gap-3">{Object.entries(analytics.predictions_by_disease).map(([disease, count]) => <div key={disease} className="flex justify-between rounded-xl bg-surface2 p-3 text-sm"><span>{disease}</span><span>{count}</span></div>)}{Object.keys(analytics.predictions_by_disease).length === 0 && <p className="text-sm text-muted">No prediction data yet.</p>}</div></div>
            <div className="rounded-2xl border border-border bg-surface p-6"><h2 className="font-semibold">Recent sign-ups</h2><div className="mt-4 space-y-3">{analytics.signups_last_30_days.map((item) => <div key={item.date} className="flex justify-between rounded-xl bg-surface2 p-3 text-sm"><span>{item.date}</span><span>{item.signups}</span></div>)}{analytics.signups_last_30_days.length === 0 && <p className="text-sm text-muted">No sign-up data yet.</p>}</div></div>
          </div>
        </div>}
  </div>;
}
