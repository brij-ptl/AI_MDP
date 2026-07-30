"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { FileText, ShieldAlert, Search, Download } from "lucide-react";

export default function ReportsAdminPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await adminService.reports();
      if (res && res.data) {
        setReports(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = reports.filter((r) => 
    r.user_id?.toLowerCase().includes(search.toLowerCase()) ||
    r.disease?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Report Management</h1>
          <p className="mt-1 text-sm text-muted">View and manage uploaded clinical reports across all users.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface2 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary"
          />
          <Search size={16} className="absolute left-3 top-3 text-muted" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface2 text-muted">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Report ID</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">User ID</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Disease Context</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Status</th>
                <th className="whitespace-nowrap px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="mt-2">Loading reports...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-coral">
                    <ShieldAlert size={24} className="mx-auto mb-2 opacity-50" />
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <FileText size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No reports found.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover-card hover:bg-surface2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-text">{report.id}</div>
                      <div className="text-xs text-muted mt-1">{new Date(report.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-muted">{report.user_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded bg-surface2 px-2 py-1 text-xs font-mono capitalize tracking-wider text-muted border border-border">
                        {report.disease || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                        report.status === 'completed' ? 'bg-good/10 text-good' : 
                        report.status === 'failed' ? 'bg-coral/10 text-coral' : 'bg-amber/10 text-amber'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                      >
                        <Download size={14} /> Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
