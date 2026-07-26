"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import { reportService, type Report } from "@/services/report.service";

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    params.then(({ id: reportId }) => {
      setId(reportId);
      reportService.getReports().then((response) => setReport(response.data.find((item) => item.id === reportId) ?? null)).catch((err) => setError(err instanceof Error ? err.message : "Failed to load report."));
    });
  }, [params]);

  return <><DashboardTopbar title={id ? `Report #${id}` : "Report"} /><div className="p-6 lg:p-10"><div className="rounded-2xl border border-border bg-surface p-8">
    {error ? <p className="text-sm text-red-500">{error}</p> : !report ? <p className="text-sm text-muted">Loading report...</p> : <div className="space-y-4 text-sm"><div><p className="text-xs uppercase text-muted">File name</p><p className="font-medium">{report.file_name}</p></div><div><p className="text-xs uppercase text-muted">Report ID</p><p>{report.id}</p></div><div><p className="text-xs uppercase text-muted">Prediction ID</p><p>{report.prediction_id}</p></div><div><p className="text-xs uppercase text-muted">Created</p><p>{new Date(report.created_at).toLocaleString()}</p></div><div><p className="text-xs uppercase text-muted">Download count</p><p>{report.download_count}</p></div><div className="flex gap-4 pt-2"><a href={reportService.download(report.id)} className="text-primary hover:underline">Download PDF</a><Link href="/reports" className="text-primary hover:underline">Back to reports</Link></div></div>}
  </div></div></>;
}
