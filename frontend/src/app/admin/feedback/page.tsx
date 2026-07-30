"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { MessageSquare, ShieldAlert, CheckCircle2, Search, AlertCircle } from "lucide-react";

export default function FeedbackAdminPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await adminService.feedback();
      if (res && res.data) {
        setFeedback(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleModerate = async (id: string, status: string) => {
    try {
      await adminService.moderateFeedback(id, status);
      await loadFeedback();
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  const filteredFeedback = feedback.filter((f) => 
    f.subject?.toLowerCase().includes(search.toLowerCase()) ||
    f.message?.toLowerCase().includes(search.toLowerCase()) ||
    f.user_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Feedback Management</h1>
          <p className="mt-1 text-sm text-muted">User-submitted feedback and support tickets.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search feedback..."
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
                <th className="whitespace-nowrap px-6 py-4 font-medium">Subject</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">User ID</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Status</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Date</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="mt-2">Loading feedback...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-coral">
                    <ShieldAlert size={24} className="mx-auto mb-2 opacity-50" />
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredFeedback.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No feedback found.</p>
                  </td>
                </tr>
              ) : (
                filteredFeedback.map((item) => (
                  <tr key={item.id} className="hover-card hover:bg-surface2 transition-colors">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-medium text-text truncate">{item.subject}</div>
                      <div className="text-xs text-muted truncate mt-1">{item.message}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-text">{item.user_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === "resolved" ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-good w-fit px-2 py-1 bg-good/10 rounded">
                          <CheckCircle2 size={14} /> Resolved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-amber w-fit px-2 py-1 bg-amber/10 rounded">
                          <AlertCircle size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status !== "resolved" ? (
                        <button
                          onClick={() => handleModerate(item.id, "resolved")}
                          className="text-xs font-medium text-good hover:text-good/80 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerate(item.id, "pending")}
                          className="text-xs font-medium text-amber hover:text-amber/80 transition-colors"
                        >
                          Mark Pending
                        </button>
                      )}
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
