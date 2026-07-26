"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { historyService, type HistoryItem } from "@/services/history.service";
import { DISEASES } from "@/constants/diseases";

const LIMIT = 10;

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [disease, setDisease] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await historyService.getHistory({
          disease: disease || undefined, risk_level: riskLevel || undefined,
          date_from: dateFrom || undefined, date_to: dateTo || undefined,
          limit: LIMIT, offset: (page - 1) * LIMIT,
        });
        setHistory(response.data.items);
        setTotal(response.data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load prediction history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [disease, riskLevel, dateFrom, dateTo, page]);

  const updateFilter = (callback: () => void) => { setPage(1); callback(); };

  return <>
    <DashboardTopbar title="Prediction History" />
    <div className="flex flex-wrap gap-4 px-6 pt-6 lg:px-10">
      <select value={disease} onChange={(e) => updateFilter(() => setDisease(e.target.value))} className="rounded-xl border border-border bg-surface px-4 py-2">
        <option value="">All Diseases</option>
        {DISEASES.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
      </select>
      <select value={riskLevel} onChange={(e) => updateFilter(() => setRiskLevel(e.target.value))} className="rounded-xl border border-border bg-surface px-4 py-2">
        <option value="">All Risk Levels</option>
        {["Low Risk", "Moderate Risk", "High Risk", "Critical Risk"].map((level) => <option key={level} value={level}>{level}</option>)}
      </select>
      <input type="date" value={dateFrom} onChange={(e) => updateFilter(() => setDateFrom(e.target.value))} className="rounded-xl border border-border bg-surface px-4 py-2" />
      <input type="date" value={dateTo} onChange={(e) => updateFilter(() => setDateTo(e.target.value))} className="rounded-xl border border-border bg-surface px-4 py-2" />
    </div>
    <div className="p-6 lg:p-10"><div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full text-left text-sm"><thead className="bg-surface2 text-muted"><tr><th className="p-4">Date</th><th className="p-4">Module</th><th className="p-4">Result</th><th className="p-4">Confidence</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan={4} className="p-8 text-center text-muted">Loading...</td></tr> : error ? <tr><td colSpan={4} className="p-8 text-center text-red-500">{error}</td></tr> : history.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-muted">No predictions found.</td></tr> : history.map((item) => <tr key={item.id} className="border-t border-border"><td className="p-4">{new Date(item.created_at).toLocaleDateString()}</td><td className="p-4">{item.disease_slug}</td><td className="p-4">{item.risk_level}</td><td className="p-4">{item.confidence_score ?? Math.round((item.probability ?? 0) * 100)}%</td></tr>)}</tbody>
      </table>
      <div className="flex items-center justify-between p-4"><Button disabled={page === 1 || loading} onClick={() => setPage((current) => current - 1)}>Previous</Button><span className="text-sm text-muted">Page {page} of {Math.max(1, Math.ceil(total / LIMIT))}</span><Button disabled={loading || page * LIMIT >= total} onClick={() => setPage((current) => current + 1)}>Next</Button></div>
    </div></div>
  </>;
}
