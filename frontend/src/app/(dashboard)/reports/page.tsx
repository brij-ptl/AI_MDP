"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Download, Clock, Activity } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import { reportService, type Report } from "@/services/report.service";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { 
    reportService.getReports()
      .then((response) => setReports(response.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports."))
      .finally(() => setLoading(false)); 
  }, []);

  return (
    <div className="animate-fadeIn">
      <DashboardTopbar title="Medical Reports" />
      <div className="space-y-6 p-6 pb-24 lg:p-10 max-w-7xl mx-auto">
        
        <div>
          <h2 className="font-display text-2xl font-extrabold text-text tracking-tight">Clinical Assessments</h2>
          <p className="mt-2 text-sm text-muted">Download and review your AI-generated health screening reports.</p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-surface p-12 flex flex-col items-center justify-center min-h-[300px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
            <p className="text-sm font-semibold text-muted">Retrieving medical documents...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-500">
            {error}
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center flex flex-col items-center">
            <FileText className="text-muted/50" size={48} />
            <h3 className="mt-4 text-lg font-display font-bold text-text">No Clinical Reports Found</h3>
            <p className="mt-2 text-sm text-muted max-w-md">You haven't generated any assessment documents yet. Run a disease prediction triage to generate your first detailed explainability report.</p>
            <Link href="/prediction" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-bg hover:bg-primary/90 transition-colors">
              <Activity size={14} /> Start Triage Evaluation
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/40 bg-surface2/50 text-muted uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="p-4 pl-6">Report Document</th>
                    <th className="p-4">Prediction ID</th>
                    <th className="p-4">Downloads</th>
                    <th className="p-4">Generated On</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {reports.map((report) => (
                    <tr key={report.id} className="transition-colors hover:bg-surface2/30 group">
                      <td className="p-4 pl-6">
                        <Link className="flex items-center gap-3 font-semibold text-text hover:text-primary transition-colors" href={`/reports/${report.id}`}>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText size={14} />
                          </div>
                          {report.file_name}
                        </Link>
                      </td>
                      <td className="p-4 text-xs font-mono text-muted">
                        {report.prediction_id.split('-')[0]}...
                      </td>
                      <td className="p-4 text-muted">
                        {report.download_count} times
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-muted">
                          <Clock size={12} />
                          {new Date(report.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <a 
                          href={reportService.download(report.id)} 
                          className="inline-flex items-center gap-1.5 rounded-full bg-surface2 px-3 py-1.5 text-[10px] font-bold text-text uppercase tracking-wider hover:bg-primary hover:text-bg transition-colors" 
                          aria-label={`Download ${report.file_name}`}
                        >
                          <Download size={12} /> Download PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
