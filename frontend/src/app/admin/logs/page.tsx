"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { List, ShieldAlert, Search } from "lucide-react";

export default function LogsAdminPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await adminService.logs();
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load system logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((l) => 
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.admin_id?.toLowerCase().includes(search.toLowerCase()) ||
    l.target_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">System Logs</h1>
          <p className="mt-1 text-sm text-muted">Audit trail of all administrative actions and security events.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search logs..."
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
                <th className="whitespace-nowrap px-6 py-4 font-medium">Log ID</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Admin ID</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Action</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Target</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="mt-2">Loading system logs...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-coral">
                    <ShieldAlert size={24} className="mx-auto mb-2 opacity-50" />
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <List size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No system logs found.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover-card hover:bg-surface2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-text">{log.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-muted">{log.admin_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded bg-surface2 px-2 py-1 text-xs font-mono uppercase tracking-wider text-primary border border-border">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-muted">{log.target_type}</div>
                      <div className="font-mono text-xs text-text mt-0.5">{log.target_id}</div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-muted text-xs">
                      {new Date(log.created_at).toLocaleString()}
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
