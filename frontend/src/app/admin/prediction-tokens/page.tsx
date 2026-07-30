"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Coins, ShieldAlert, Search, PlusCircle, MinusCircle } from "lucide-react";

export default function PredictionTokensAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadTokenUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await adminService.tokenUsers(search);
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load token users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokenUsers();
  }, [search]); // re-fetch on search change if API supports it, or handle client side

  const handleUpdateTokens = async (userId: string, operation: "add" | "remove" | "set", amount: number) => {
    try {
      await adminService.updateTokens(userId, { operation, amount, reason: "Admin adjustment" });
      await loadTokenUsers();
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  const filteredUsers = users.filter((u) => 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Prediction Tokens</h1>
          <p className="mt-1 text-sm text-muted">Manage and audit prediction token balances across all users.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search users..."
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
                <th className="whitespace-nowrap px-6 py-4 font-medium">User</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Subscription</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Token Balance</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium text-right">Adjust Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="mt-2">Loading users...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-coral">
                    <ShieldAlert size={24} className="mx-auto mb-2 opacity-50" />
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted">
                    <Coins size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No token users found.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover-card hover:bg-surface2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">{user.full_name}</div>
                      <div className="text-xs text-muted">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="capitalize">{user.subscription || "Free"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-amber text-lg">{user.prediction_tokens}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdateTokens(user.id, "remove", 1)}
                          className="flex h-8 items-center gap-1 rounded bg-surface2 px-3 text-xs font-medium text-coral hover:bg-coral hover:text-white transition-colors border border-border hover:border-coral"
                          title="Remove 1 token"
                        >
                          <MinusCircle size={14} /> Remove
                        </button>
                        <button
                          onClick={() => handleUpdateTokens(user.id, "add", 1)}
                          className="flex h-8 items-center gap-1 rounded bg-surface2 px-3 text-xs font-medium text-teal hover:bg-teal hover:text-white transition-colors border border-border hover:border-teal"
                          title="Add 1 token"
                        >
                          <PlusCircle size={14} /> Add
                        </button>
                      </div>
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
