"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import { historyService } from "@/services/history.service";
import Button from "@/components/ui/Button";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [disease, setDisease] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const LIMIT = 10;
  const fetchHistory = async () => {
    setLoading(true);

    try {
      const response: any = await historyService.getHistory({
        disease: disease || undefined,
        risk_level: riskLevel || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      });

      setHistory(response.data.data ?? response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
        "Failed to load prediction history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [
    disease,
    riskLevel,
    dateFrom,
    dateTo,
    page,
  ]);
  return (
    <>
      <DashboardTopbar title="Prediction History" />
      <div className="flex flex-wrap gap-4 px-6 pt-6 lg:px-10">
        <select
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-2"
        >
          <option value="">All Diseases</option>
          <option value="diabetes">Diabetes</option>
          <option value="heart">Heart Disease</option>
          <option value="parkinsons">Parkinson's</option>
          <option value="liver">Liver Disease</option>
        </select>

        <select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-2"
        >
          <option value="">All Risk Levels</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-2"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-2"
        />
      </div>
      <div className="p-6 lg:p-10">
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface2 text-muted">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Module</th>
                <th className="p-4">Result</th>
                <th className="p-4">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted">
                    No predictions found.
                  </td>
                </tr>
              ) : (
                history.map((item: any) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="p-4">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      {item.disease}
                    </td>

                    <td className="p-4">
                      {item.risk_level}
                    </td>

                    <td className="p-4">
                      {item.confidence_score}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="mt-6 flex justify-between">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="self-center">
              Page {page}
            </span>

            <Button
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
