"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Stethoscope, UploadCloud, MessageSquareText, TrendingUp, FileText, ChevronRight, Award, Activity, Bell } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { dashboardService } from "@/services/dashboard.service";

type QuotaValue = number | "unlimited";
type Overview = { 
  health_score: number; 
  total_predictions: number; 
  recent_predictions: Array<{ id: string; disease_slug: string; risk_level: string; probability: number; created_at: string }>; 
  subscription_plan: string; 
  is_premium_active: boolean; 
  predictions_remaining: QuotaValue; 
  prediction_tokens: QuotaValue; 
  subscription_remaining: QuotaValue; 
  free_trial_remaining: QuotaValue; 
  unread_notifications: number 
};

export default function DashboardOverviewPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => { 
    dashboardService.overview()
      .then((response: any) => setOverview(response.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard.")); 
  }, []);

  const stats = overview ? [
    { label: "Predictions run", value: overview.total_predictions, sub: "All time", icon: TrendingUp },
    { label: "Health score", value: `${overview.health_score}/100`, sub: "Based on recent predictions", icon: Activity },
    { label: "Prediction tokens", value: overview.prediction_tokens, sub: "Independent credits", icon: Stethoscope },
    { label: "Subscription access", value: overview.subscription_remaining, sub: overview.subscription_plan.replace(/_/g, " "), icon: Award },
    { label: "Free trial remaining", value: overview.free_trial_remaining, sub: "Used after tokens", icon: Stethoscope },
    { label: "Unread notifications", value: overview.unread_notifications, sub: "Account activity", icon: Bell },
  ] : [];

  return (
    <>
      <DashboardTopbar title="Health Dashboard" />
      <div className="min-h-screen space-y-8 bg-bg p-6 pb-24 lg:p-10">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-sm">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl font-extrabold text-text tracking-tight">Health Dashboard</h2>
                {overview?.is_premium_active && (
                  <span className="flex items-center gap-1 rounded-full border border-warning/20 bg-warning/10 px-2.5 py-0.5 text-[10px] font-bold text-warning shadow-sm">
                    <Award size={10} /> Premium member
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted">Your AI clinical triage environment is active.</p>
            </div>
            {!overview?.is_premium_active && overview && (
              <Button href="/subscription" className="w-full px-5 py-2.5 text-xs md:w-auto shadow-sm">Upgrade subscription</Button>
            )}
          </div>
        </div>
        
        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-500 animate-fadeIn">
            {error}
          </div>
        ) : !overview ? (
          <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted animate-pulse flex items-center justify-center min-h-[200px]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="animate-fadeIn space-y-8">
            
            {/* Stats Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => { 
                const Icon = stat.icon; 
                return (
                  <div key={stat.label} className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted group-hover:text-text transition-colors">{stat.label}</span>
                      <Icon size={16} className="text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="mt-4 text-3xl font-display font-extrabold text-text">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted">{stat.sub}</p>
                  </div>
                ); 
              })}
            </div>
            
            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["/prediction", "Run Disease Prediction", "Submit diagnostic metrics across disease modules.", Stethoscope], 
                ["/symptom-checker", "AI Symptom Checker", "Instant symptom triage matching via NLP.", MessageSquareText], 
                ["/upload-report", "Upload Medical Report", "Auto-fill variables from PDF or image OCR.", UploadCloud]
              ].map(([href, title, description, Icon]: any) => (
                <Link key={href} href={href} className="group flex min-h-[140px] flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-glow">
                  <div className="flex items-start justify-between">
                    <span className="rounded-xl bg-surface2 p-3 text-primary transition-colors group-hover:bg-primary/10">
                      <Icon size={20} />
                    </span>
                    <ChevronRight size={18} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors">{title}</h3>
                    <p className="mt-1 text-xs text-muted leading-relaxed">{description}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Recent Predictions Table */}
            <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/60 px-6 py-5 bg-surface2/50">
                <h3 className="flex items-center gap-2 text-sm font-bold text-text">
                  <Activity size={16} className="text-primary" /> Recent Predictions
                </h3>
                <Link href="/history" className="text-xs font-semibold text-primary hover:underline transition-colors">View All History →</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/40 bg-surface/50 text-muted uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-4 pl-6">Module</th>
                      <th className="p-4">Date Evaluated</th>
                      <th className="p-4">Risk score</th>
                      <th className="p-4 pr-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {overview.recent_predictions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Activity size={24} className="text-muted/50" />
                            <p>No predictions run yet.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      overview.recent_predictions.map((prediction) => (
                        <tr key={prediction.id} className="transition-colors hover:bg-surface2/30">
                          <td className="p-4 pl-6 font-semibold text-text">{prediction.disease_slug}</td>
                          <td className="p-4 text-muted">{new Date(prediction.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                          <td className="p-4 font-bold text-text">
                            <span className="inline-flex items-center gap-1.5">
                              {Math.round(prediction.probability * 100)}%
                              <div className="h-1.5 w-12 overflow-hidden rounded-full bg-border">
                                <div 
                                  className={`h-full rounded-full ${prediction.probability > 0.5 ? 'bg-[#C1554A]' : prediction.probability > 0.2 ? 'bg-[#D4A373]' : 'bg-primary'}`} 
                                  style={{ width: `${Math.round(prediction.probability * 100)}%` }} 
                                />
                              </div>
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                              prediction.risk_level.toLowerCase() === 'high' 
                                ? 'border-[#C1554A]/20 bg-[#C1554A]/10 text-[#C1554A]' 
                                : prediction.risk_level.toLowerCase() === 'moderate'
                                  ? 'border-[#D4A373]/20 bg-[#D4A373]/10 text-[#D4A373]'
                                  : 'border-primary/20 bg-primary/10 text-primary'
                            }`}>
                              {prediction.risk_level}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
