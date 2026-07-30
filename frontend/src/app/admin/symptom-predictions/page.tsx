"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Stethoscope, ShieldAlert, Search, Eye } from "lucide-react";

export default function SymptomPredictionsAdminPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await adminService.symptomPredictions();
      if (res && res.data) {
        setPredictions(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load symptom predictions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  const filteredPredictions = predictions.filter((p) => 
    p.user_id?.toLowerCase().includes(search.toLowerCase()) ||
    p.symptoms?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">AI Symptom Predictions</h1>
          <p className="mt-1 text-sm text-muted">View all symptom predictions and AI analysis history.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search symptoms or users..."
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
                <th className="whitespace-nowrap px-6 py-4 font-medium">Prediction ID</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">User ID</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Symptoms Input</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Primary Condition</th>
                <th className="whitespace-nowrap px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="mt-2">Loading predictions...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-coral">
                    <ShieldAlert size={24} className="mx-auto mb-2 opacity-50" />
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredPredictions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <Stethoscope size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No predictions found.</p>
                  </td>
                </tr>
              ) : (
                filteredPredictions.map((prediction) => (
                  <tr key={prediction.id} className="hover-card hover:bg-surface2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-text">{prediction.id}</div>
                      <div className="text-xs text-muted mt-1">{new Date(prediction.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-muted">{prediction.user_id}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm truncate" title={prediction.symptoms}>
                        {prediction.symptoms}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded bg-surface2 px-2 py-1 text-xs font-medium text-teal border border-border">
                        {prediction.primary_condition || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={14} /> Details
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
