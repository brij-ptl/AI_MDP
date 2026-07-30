"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Activity, ShieldAlert, CheckCircle2, XCircle, Search } from "lucide-react";

export default function DiseasesAdminPage() {
  const [diseases, setDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadDiseases = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await adminService.diseases();
      if (res && res.data) {
        setDiseases(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load diseases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiseases();
  }, []);

  const handleToggleStatus = async (slug: string, currentActive: boolean) => {
    try {
      if (currentActive) {
        await adminService.disableDisease(slug);
      } else {
        await adminService.enableDisease(slug);
      }
      await loadDiseases();
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  const filteredDiseases = diseases.filter((d) => 
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Disease Management</h1>
          <p className="mt-1 text-sm text-muted">Enable/disable disease modules and track their model accuracy.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search diseases..."
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
                <th className="whitespace-nowrap px-6 py-4 font-medium">Disease</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Category</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Accuracy</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Status</th>
                <th className="whitespace-nowrap px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="mt-2">Loading diseases...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-coral">
                    <ShieldAlert size={24} className="mx-auto mb-2 opacity-50" />
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredDiseases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <Activity size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No diseases found.</p>
                  </td>
                </tr>
              ) : (
                filteredDiseases.map((disease) => (
                  <tr key={disease.slug} className="hover-card hover:bg-surface2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">{disease.name}</div>
                      <div className="text-xs text-muted">v{disease.model_version || "1.0"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded bg-surface2 px-2 py-1 text-xs font-mono tracking-wider text-muted border border-border">
                        {disease.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-teal">{(disease.model_accuracy * 100).toFixed(1)}%</div>
                      <div className="text-xs text-muted">Data: {disease.data_source}</div>
                    </td>
                    <td className="px-6 py-4">
                      {disease.is_active ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-good">
                          <CheckCircle2 size={14} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-coral">
                          <XCircle size={14} /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(disease.slug, disease.is_active)}
                        className={`text-xs font-medium transition-colors ${disease.is_active ? "text-coral hover:text-coral/80" : "text-good hover:text-good/80"}`}
                      >
                        {disease.is_active ? "Disable" : "Enable"}
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
