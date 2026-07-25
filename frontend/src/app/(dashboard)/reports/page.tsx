"use client";

import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { reportService } from "@/services/report.service";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response: any = await reportService.getReports();

        setReports(response.data.data ?? response.data ?? response);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
  const handleDownload = async (reportId: number | string) => {
    try {
      const blob = await reportService.downloadReport(reportId);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${reportId}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download report", err);
      alert("Unable to download report.");
    }
  };

  return (
    <>
      <DashboardTopbar title="My Reports" />
      <div className="p-6 lg:p-10">
        {loading ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            Loading reports...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-red-500">
            {error}
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <FileText className="mx-auto text-primary" size={32} />

            <h3 className="mt-4 font-semibold">
              No reports yet
            </h3>

            <p className="mt-2 text-sm text-muted">
              Run a disease prediction to generate your first report.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface2 text-muted">
                <tr>
                  <th className="p-4">Report</th>
                  <th className="p-4">Disease</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report: any) => (
                  <tr
                    key={report.id}
                    className="border-t border-border"
                  >
                    <td className="p-4">
                      {report.file_name}
                    </td>

                    <td className="p-4">
                      {report.disease}
                    </td>

                    <td className="p-4">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <Button onClick={() => handleDownload(report.id)}>
                        <Download size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
