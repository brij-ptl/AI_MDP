"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { historyService, type HistoryItem } from "@/services/history.service";
import { DISEASES } from "@/constants/diseases";
import { Search, Filter, Calendar, Activity } from "lucide-react";

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
          disease: disease || undefined, 
          risk_level: riskLevel || undefined,
          date_from: dateFrom || undefined, 
          date_to: dateTo || undefined,
          limit: LIMIT, 
          offset: (page - 1) * LIMIT,
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

  const updateFilter = (callback: () => void) => { 
    setPage(1); 
    callback(); 
  };

  return (
    <div className="animate-fadeIn">
      <DashboardTopbar title="Prediction History" />
      
      <div className="space-y-6 p-6 pb-24 lg:p-10 max-w-7xl mx-auto">
        
        <div>
          <h2 className="font-display text-2xl font-extrabold text-text tracking-tight">Clinical Archive</h2>
          <p className="mt-2 text-sm text-muted">Review and filter your past AI triage results.</p>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-muted px-2 border-r border-border/50 hidden md:flex">
            <Filter size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="relative">
              <select 
                value={disease} 
                onChange={(e) => updateFilter(() => setDisease(e.target.value))} 
                className="w-full appearance-none rounded-xl border border-border bg-surface2 px-4 py-2.5 text-sm text-text focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
              >
                <option value="">All Modules</option>
                {DISEASES.map((item) => (
                  <option key={item.slug} value={item.slug}>{item.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <select 
                value={riskLevel} 
                onChange={(e) => updateFilter(() => setRiskLevel(e.target.value))} 
                className="w-full appearance-none rounded-xl border border-border bg-surface2 px-4 py-2.5 text-sm text-text focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
              >
                <option value="">All Risk Levels</option>
                {["Low Risk", "Moderate Risk", "High Risk", "Critical Risk"].map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div className="relative flex items-center">
              <Calendar size={14} className="absolute left-3 text-muted pointer-events-none" />
              <input 
                type="date" 
                value={dateFrom} 
                onChange={(e) => updateFilter(() => setDateFrom(e.target.value))} 
                className="w-full rounded-xl border border-border bg-surface2 pl-9 pr-4 py-2.5 text-sm text-text focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors [color-scheme:dark]" 
                aria-label="Start date"
              />
            </div>
            
            <div className="relative flex items-center">
              <Calendar size={14} className="absolute left-3 text-muted pointer-events-none" />
              <input 
                type="date" 
                value={dateTo} 
                onChange={(e) => updateFilter(() => setDateTo(e.target.value))} 
                className="w-full rounded-xl border border-border bg-surface2 pl-9 pr-4 py-2.5 text-sm text-text focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors [color-scheme:dark]" 
                aria-label="End date"
              />
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/40 bg-surface2/50 text-muted uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-4 pl-6">Date Evaluated</th>
                  <th className="p-4">Clinical Module</th>
                  <th className="p-4">Risk Profile</th>
                  <th className="p-4 pr-6">AI Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-muted">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span className="text-xs">Fetching records...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#C1554A] bg-[#C1554A]/5">
                      {error}
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-muted">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search size={24} className="text-muted/50 mb-2" />
                        <p>No predictions match your current filters.</p>
                        <Button onClick={() => { setDisease(""); setRiskLevel(""); setDateFrom(""); setDateTo(""); }} className="mt-4 px-4 py-2 text-xs" variant="outline">Clear Filters</Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-surface2/30">
                      <td className="p-4 pl-6 text-muted">
                        {new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 font-semibold text-text capitalize">
                        {item.disease_slug.replace('-', ' ')}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          item.risk_level.toLowerCase().includes('high') || item.risk_level.toLowerCase().includes('critical')
                            ? 'border-[#C1554A]/20 bg-[#C1554A]/10 text-[#C1554A]' 
                            : item.risk_level.toLowerCase().includes('moderate')
                              ? 'border-[#D4A373]/20 bg-[#D4A373]/10 text-[#D4A373]'
                              : 'border-primary/20 bg-primary/10 text-primary'
                        }`}>
                          {item.risk_level}
                        </span>
                      </td>
                      <td className="p-4 pr-6 font-bold text-text">
                        <span className="inline-flex items-center gap-1.5">
                          {item.confidence_score ?? Math.round((item.probability ?? 0) * 100)}%
                          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-border">
                            <div 
                              className={`h-full rounded-full ${
                                (item.confidence_score ?? (item.probability ?? 0) * 100) > 50 
                                  ? 'bg-primary' 
                                  : 'bg-[#D4A373]'
                              }`} 
                              style={{ width: `${item.confidence_score ?? Math.round((item.probability ?? 0) * 100)}%` }} 
                            />
                          </div>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {total > 0 && (
            <div className="flex items-center justify-between border-t border-border/60 bg-surface2/20 p-4 px-6">
              <Button 
                disabled={page === 1 || loading} 
                onClick={() => setPage((current) => current - 1)}
                variant="outline"
                className="px-4 py-2 text-xs"
              >
                Previous
              </Button>
              <span className="text-xs font-medium text-muted">
                Page {page} of {Math.max(1, Math.ceil(total / LIMIT))}
              </span>
              <Button 
                disabled={loading || page * LIMIT >= total} 
                onClick={() => setPage((current) => current + 1)}
                variant="outline"
                className="px-4 py-2 text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
