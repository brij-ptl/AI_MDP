"use client";
 
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { 
  Stethoscope, UploadCloud, MessageSquareText, TrendingUp, 
  Calendar, FileText, ArrowRight, Download, Activity, 
  ChevronRight, Heart, ShieldAlert, Award, Clock
} from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import { DISEASES } from "@/constants/diseases";
import Button from "@/components/ui/Button";

// Interactive simulated predictions
const initialPredictions = [
  { module: "Heart Disease", date: "Jul 24, 2026", risk: "12.4%", status: "Low Risk", color: "text-green-500 bg-green-500/10 border-green-500/20" },
  { module: "Diabetes Risk", date: "Jul 22, 2026", risk: "28.1%", status: "Normal", color: "text-green-500 bg-green-500/10 border-green-500/20" },
  { module: "Hypertension", date: "Jun 15, 2026", risk: "48.2%", status: "Moderate", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
];

export default function DashboardOverviewPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsSubscribed(Cookies.get("vitalis_subscribed") === "true");
  }, []);

  return (
    <>
      <DashboardTopbar title="Health Dashboard" />
      <div className="p-6 lg:p-10 space-y-8 bg-bg min-h-screen pb-24">
        {/* Welcome Greeting Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-extrabold text-text">Welcome Back, Patient</h2>
                {isSubscribed && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                    <Award size={10} /> Care+ Member
                  </span>
                )}
              </div>
              <p className="text-sm text-muted max-w-xl">
                Your Nidaan+ AI Clinical triage environment is active. Standard secure encryption protocols are enforced.
              </p>
            </div>
            {!isSubscribed && (
              <Button href="/subscription" className="w-full md:w-auto text-xs py-2.5 px-5">
                Upgrade to Care+
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Predictions run", value: "3", sub: "Last run 2h ago", icon: TrendingUp },
            { label: "Reports generated", value: "2", sub: "PDF Vault synced", icon: FileText },
            { label: "Symptom checks", value: "5", sub: "NLP triage log", icon: MessageSquareText },
            { label: "Disease models", value: String(DISEASES.length), sub: "Clinical compliance", icon: Stethoscope },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="rounded-2xl border border-border bg-surface p-5 hover:border-primary/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">{stat.label}</span>
                  <Icon size={18} className="text-primary" />
                </div>
                <p className="mt-4 text-3xl font-extrabold text-text">{stat.value}</p>
                <p className="text-[10px] text-muted mt-1">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/prediction" className="group rounded-2xl border border-border bg-surface p-6 hover:border-primary/40 hover:shadow-glow transition-all duration-300 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="p-3 rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110"><Stethoscope size={20} /></span>
              <span className="text-muted group-hover:text-primary transition-all duration-300 group-hover:translate-x-1"><ChevronRight size={18} /></span>
            </div>
            <div>
              <h3 className="font-bold text-text text-sm">Run Disease Prediction</h3>
              <p className="mt-1 text-xs text-muted">Submit diagnostic metrics across 16 disease modules.</p>
            </div>
          </Link>
          <Link href="/symptom-checker" className="group rounded-2xl border border-border bg-surface p-6 hover:border-primary/40 hover:shadow-glow transition-all duration-300 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="p-3 rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110"><MessageSquareText size={20} /></span>
              <span className="text-muted group-hover:text-primary transition-all duration-300 group-hover:translate-x-1"><ChevronRight size={18} /></span>
            </div>
            <div>
              <h3 className="font-bold text-text text-sm">AI Symptom Checker</h3>
              <p className="mt-1 text-xs text-muted">Instant symptom triage matching via NLP engine.</p>
            </div>
          </Link>
          <Link href="/upload-report" className="group rounded-2xl border border-border bg-surface p-6 hover:border-primary/40 hover:shadow-glow transition-all duration-300 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <span className="p-3 rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110"><UploadCloud size={20} /></span>
              <span className="text-muted group-hover:text-primary transition-all duration-300 group-hover:translate-x-1"><ChevronRight size={18} /></span>
            </div>
            <div>
              <h3 className="font-bold text-text text-sm">Upload Medical Report</h3>
              <p className="mt-1 text-xs text-muted">Auto-fill variables from PDF/Image using OCR extraction.</p>
            </div>
          </Link>
        </div>

        {/* Dashboard 2-Column Split */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Predictions */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
                <h3 className="font-bold text-text text-sm flex items-center gap-2"><Activity size={16} className="text-primary" /> Recent Predictions</h3>
                <Link href="/history" className="text-xs text-primary font-semibold hover:underline">View History</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-bg/50 text-muted border-b border-border/40">
                    <tr>
                      <th className="p-4 font-semibold uppercase tracking-wider">Module</th>
                      <th className="p-4 font-semibold uppercase tracking-wider">Date Evaluated</th>
                      <th className="p-4 font-semibold uppercase tracking-wider">AI Confidence</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {initialPredictions.map((pred, i) => (
                      <tr key={i} className="hover:bg-bg/25 transition-colors">
                        <td className="p-4 font-bold text-text flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-primary" /> {pred.module}
                        </td>
                        <td className="p-4 text-muted">{pred.date}</td>
                        <td className="p-4 text-primary font-bold">{pred.risk}</td>
                        <td className="p-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${pred.color}`}>
                            {pred.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Health Timeline */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm flex items-center gap-2"><Clock size={16} className="text-primary" /> Clinical Timeline</h3>
              <div className="relative border-l border-border/80 ml-3 pl-6 space-y-6">
                {[
                  { time: "Today, 02:14 PM", title: "Heart Disease screening complete", desc: "Risk index: 12.4% (Low). Physical recommendation checklist generated." },
                  { time: "Yesterday, 11:30 AM", title: "OCR lab analysis report extracted", desc: "Successfully mapped 14 clinical fields from uploaded PDF." },
                  { time: "Jul 22, 2026", title: "Symptom check completed", desc: "System triage suggestion: Tension Headache. Checked light sensitivity markers." }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[31px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-primary ring-4 ring-surface" />
                    <p className="text-[10px] text-muted font-semibold">{item.time}</p>
                    <h4 className="text-xs font-bold text-text mt-0.5">{item.title}</h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Column */}
          <div className="space-y-8">
            {/* Upcoming/Recommended Tests */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm flex items-center gap-2"><Calendar size={16} className="text-primary" /> Recommended Tests</h3>
              <div className="space-y-4">
                {[
                  { name: "Lipid Profile Panel", desc: "Evaluate cholesterol baseline ratios.", date: "Recommended: Aug 2026" },
                  { name: "HbA1c Blood Test", desc: "Establish sugar average parameters.", date: "Recommended: Sep 2026" }
                ].map((test, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-bg/40 space-y-2">
                    <h4 className="font-bold text-text text-xs">{test.name}</h4>
                    <p className="text-xs text-muted leading-relaxed">{test.desc}</p>
                    <p className="text-[10px] font-semibold text-primary">{test.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports Vault */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm flex items-center gap-2"><FileText size={16} className="text-primary" /> Reports Vault</h3>
              <div className="space-y-3">
                {[
                  { title: "Heart_Prediction_Report.pdf", date: "Generated Jul 24, 2026" },
                  { title: "OCR_Lab_Report_Extract.pdf", date: "Generated Jul 23, 2026" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/30 transition-all duration-200 bg-bg/25">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500"><FileText size={16} /></span>
                      <div>
                        <p className="text-xs font-semibold text-text max-w-[150px] truncate">{item.title}</p>
                        <p className="text-[9px] text-muted">{item.date}</p>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-bg transition-colors" aria-label="Download PDF">
                      <Download size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
