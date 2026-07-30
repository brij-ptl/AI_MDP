"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { ShieldAlert, BarChart3, Users, DollarSign, Activity } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminService.platformAnalytics()
      .then((response: any) => setAnalytics(response.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load platform analytics."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Platform Analytics</h1>
        <p className="mt-1 text-sm text-muted">Aggregate usage, revenue, and sign-up analytics across modules.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center text-muted">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-4">Loading analytics data...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-coral/30 bg-coral/5 p-8 text-center text-coral">
          <ShieldAlert size={32} className="mx-auto mb-4 opacity-50" />
          <p>{error}</p>
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="hover-card rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/50">
              <div className="flex items-center gap-3 text-muted">
                <Users size={18} />
                <p className="text-xs font-medium uppercase tracking-wider">Total Users</p>
              </div>
              <p className="mt-4 text-3xl font-bold font-mono text-text">{analytics.total_users}</p>
            </div>
            
            <div className="hover-card rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/50">
              <div className="flex items-center gap-3 text-muted">
                <Activity size={18} />
                <p className="text-xs font-medium uppercase tracking-wider">Predictions</p>
              </div>
              <p className="mt-4 text-3xl font-bold font-mono text-text">{analytics.total_predictions}</p>
            </div>
            
            <div className="hover-card rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/50">
              <div className="flex items-center gap-3 text-muted">
                <BarChart3 size={18} />
                <p className="text-xs font-medium uppercase tracking-wider">Active Subs</p>
              </div>
              <p className="mt-4 text-3xl font-bold font-mono text-text">{analytics.active_subscriptions}</p>
            </div>
            
            <div className="hover-card rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/50">
              <div className="flex items-center gap-3 text-muted">
                <DollarSign size={18} />
                <p className="text-xs font-medium uppercase tracking-wider">Revenue</p>
              </div>
              <p className="mt-4 text-3xl font-bold font-mono text-teal">₹{analytics.total_revenue_inr}</p>
            </div>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="border-b border-border bg-surface2 px-6 py-4">
                <h2 className="font-semibold">Predictions by Disease</h2>
              </div>
              <div className="p-6">
                <div className="grid gap-3">
                  {Object.entries(analytics.predictions_by_disease).map(([disease, count]) => (
                    <div key={disease} className="flex justify-between rounded-xl bg-surface2 px-4 py-3 text-sm hover:bg-border/50 transition-colors">
                      <span className="capitalize">{disease.replace(/_/g, " ")}</span>
                      <span className="font-mono font-medium">{count}</span>
                    </div>
                  ))}
                  {Object.keys(analytics.predictions_by_disease).length === 0 && (
                    <p className="text-sm text-muted text-center py-4">No prediction data yet.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="border-b border-border bg-surface2 px-6 py-4">
                <h2 className="font-semibold">Recent Sign-ups (30 Days)</h2>
              </div>
              <div className="p-6 max-h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  {analytics.signups_last_30_days.map((item) => (
                    <div key={item.date} className="flex justify-between rounded-xl bg-surface2 px-4 py-3 text-sm hover:bg-border/50 transition-colors">
                      <span className="text-muted">{item.date}</span>
                      <span className="font-mono font-medium text-primary">+{item.signups}</span>
                    </div>
                  ))}
                  {analytics.signups_last_30_days.length === 0 && (
                    <p className="text-sm text-muted text-center py-4">No sign-up data yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
