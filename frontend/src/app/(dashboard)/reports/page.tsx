"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Download } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import { reportService, type Report } from "@/services/report.service";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { reportService.getReports().then((response) => setReports(response.data)).catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports.")).finally(() => setLoading(false)); }, []);

  return <><DashboardTopbar title="My Reports" /><div className="p-6 lg:p-10">
    {loading ? <div className="rounded-2xl border border-border bg-surface p-8 text-center">Loading reports...</div> : error ? <div className="rounded-2xl border border-border bg-surface p-8 text-center text-red-500">{error}</div> : reports.length === 0 ? <div className="rounded-2xl border border-border bg-surface p-8 text-center"><FileText className="mx-auto text-primary" size={32} /><h3 className="mt-4 font-semibold">No reports yet</h3><p className="mt-2 text-sm text-muted">Run a disease prediction to generate your first report.</p></div> : <div className="overflow-hidden rounded-2xl border border-border"><table className="w-full text-left text-sm"><thead className="bg-surface2 text-muted"><tr><th className="p-4">Report</th><th className="p-4">Prediction ID</th><th className="p-4">Downloads</th><th className="p-4">Created</th><th className="p-4">Action</th></tr></thead><tbody>{reports.map((report) => <tr key={report.id} className="border-t border-border"><td className="p-4"><Link className="hover:text-primary" href={`/reports/${report.id}`}>{report.file_name}</Link></td><td className="p-4">{report.prediction_id}</td><td className="p-4">{report.download_count}</td><td className="p-4">{new Date(report.created_at).toLocaleDateString()}</td><td className="p-4"><a href={reportService.download(report.id)} className="inline-flex rounded-full p-2 text-primary hover:bg-primary/10" aria-label={`Download ${report.file_name}`}><Download size={16} /></a></td></tr>)}</tbody></table></div>}
  </div></>;
}
