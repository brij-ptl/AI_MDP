"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Users, Activity, CreditCard, Award, TrendingUp } from "lucide-react";

type PlatformAnalytics = {
  total_users: number;
  total_predictions: number;
  total_revenue_inr: number;
  active_subscriptions: number;
  predictions_by_disease: Record<string, number>;
};

export default function DashboardAdminPage() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService.platformAnalytics()
      .then((response: any) => setAnalytics(response.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load platform analytics."));
  }, []);

  const stats = analytics ? [
    { label: "Total Users", value: analytics.total_users, icon: Users },
    { label: "Predictions Run", value: analytics.total_predictions, icon: Activity },
    { label: "Active Subscriptions", value: analytics.active_subscriptions, icon: Award },
    { label: "Total Revenue", value: `₹${analytics.total_revenue_inr.toLocaleString('en-IN')}`, icon: CreditCard },
  ] : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-text tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-muted">Platform-wide KPIs: active users, predictions run, revenue, and subscriptions.</p>
      </div>
      
      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-500">
          {error}
        </div>
      ) : !analytics ? (
        <div className="rounded-2xl border border-border bg-surface p-12 flex flex-col items-center justify-center min-h-[300px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
          <p className="text-sm font-semibold text-muted">Aggregating platform data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted group-hover:text-text transition-colors">{stat.label}</span>
                    <Icon size={16} className="text-primary/70 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="mt-4 text-3xl font-display font-extrabold text-text">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border/60 px-6 py-5 bg-surface2/50">
              <TrendingUp size={16} className="text-primary" />
              <h2 className="text-sm font-bold text-text">Predictions by Disease Model</h2>
            </div>
            
            <div className="p-6">
              {Object.keys(analytics.predictions_by_disease).length === 0 ? (
                <div className="py-8 text-center text-muted">
                  <Activity size={24} className="mx-auto text-muted/50 mb-2" />
                  <p className="text-sm">No prediction data available yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Object.entries(analytics.predictions_by_disease).map(([disease, count]) => (
                    <div key={disease} className="flex flex-col justify-between rounded-xl bg-surface2 p-4 transition-colors hover:bg-surface2/80">
                      <span className="text-xs font-semibold text-muted uppercase tracking-wider">{disease}</span>
                      <span className="mt-2 text-2xl font-bold text-text">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
