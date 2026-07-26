"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminService, type TokenHistoryItem, type TokenUser } from "@/services/admin.service";

type Operation = "add" | "remove" | "set" | "reset";

export default function PredictionTokensAdminPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<TokenUser[]>([]);
  const [selected, setSelected] = useState<TokenUser | null>(null);
  const [history, setHistory] = useState<TokenHistoryItem[]>([]);
  const [operation, setOperation] = useState<Operation>("add");
  const [amount, setAmount] = useState("1");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async (search = query) => {
    setLoading(true);
    setError("");
    try {
      const response = await adminService.tokenUsers(search);
      setUsers(response.data);
      if (selected) setSelected(response.data.find((user) => user.id === selected.id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (userId: string) => {
    const response = await adminService.tokenHistory(userId);
    setHistory(response.data);
  };

  useEffect(() => { loadUsers(""); }, []);

  const selectUser = async (user: TokenUser) => {
    setSelected(user);
    setError("");
    try {
      await loadHistory(user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load token history.");
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    const parsedAmount = Number(amount);
    if (operation !== "reset" && (!Number.isInteger(parsedAmount) || parsedAmount < 0)) {
      setError("Enter a whole number of tokens.");
      return;
    }
    setError("");
    try {
      const response = await adminService.updateTokens(selected.id, {
        operation,
        ...(operation === "reset" ? {} : { amount: parsedAmount }),
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      });
      setSelected(response.data);
      setUsers((current) => current.map((user) => user.id === response.data.id ? response.data : user));
      setReason("");
      await loadHistory(selected.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update tokens.");
    }
  };

  return <div className="space-y-6">
    <div><h1 className="font-display text-2xl font-bold">Prediction Token Management</h1><p className="mt-2 text-sm text-muted">Grant independent prediction credits and review every adjustment.</p></div>
    <form onSubmit={(event) => { event.preventDefault(); loadUsers(query); }} className="flex gap-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, or user ID" className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary" /><button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-bg">Search</button></form>
    {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}
    <div className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface"><table className="w-full text-left text-sm"><thead className="bg-surface2 text-muted"><tr><th className="p-4">User</th><th className="p-4">Tokens</th><th className="p-4">Subscription</th><th className="p-4">Status</th></tr></thead><tbody>{loading ? <tr><td colSpan={4} className="p-6 text-center text-muted">Loading users...</td></tr> : users.length === 0 ? <tr><td colSpan={4} className="p-6 text-center text-muted">No users found.</td></tr> : users.map((user) => <tr key={user.id} onClick={() => selectUser(user)} className={`cursor-pointer border-t border-border hover:bg-surface2 ${selected?.id === user.id ? "bg-primary/5" : ""}`}><td className="p-4"><p className="font-medium">{user.full_name}</p><p className="text-xs text-muted">{user.email}</p></td><td className="p-4">{user.prediction_tokens}</td><td className="p-4 capitalize">{user.subscription.replace(/_/g, " ")}</td><td className="p-4">{user.is_active ? user.role : "Suspended"}</td></tr>)}</tbody></table></div>
      <div className="space-y-6">{selected ? <><div className="rounded-2xl border border-border bg-surface p-6"><h2 className="font-semibold">{selected.full_name}</h2><p className="mt-1 text-sm text-muted">{selected.email} · {selected.role}</p><p className="mt-4 text-3xl font-bold text-primary">{selected.prediction_tokens} <span className="text-sm font-medium text-muted">tokens</span></p><form onSubmit={submit} className="mt-5 space-y-3"><select value={operation} onChange={(event) => setOperation(event.target.value as Operation)} className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm"><option value="add">Add tokens</option><option value="remove">Remove tokens</option><option value="set">Set exact token count</option><option value="reset">Reset tokens</option></select>{operation !== "reset" && <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm" aria-label="Token amount" />}<input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason (optional)" className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm" /><button className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-bg">Apply change</button></form></div><div className="rounded-2xl border border-border bg-surface p-6"><h2 className="font-semibold">Token history</h2><div className="mt-4 space-y-3">{history.length === 0 ? <p className="text-sm text-muted">No token adjustments yet.</p> : history.map((item) => <div key={item.id} className="rounded-xl bg-surface2 p-3 text-xs"><p className="font-semibold capitalize">{item.operation}: {item.old_value} → {item.new_value}</p><p className="mt-1 text-muted">{new Date(item.created_at).toLocaleString()}{item.reason ? ` · ${item.reason}` : ""}</p></div>)}</div></div></> : <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">Select a user to manage tokens.</div>}</div>
    </div>
  </div>;
}
