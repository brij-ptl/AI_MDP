"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { User, ShieldAlert, CheckCircle2, XCircle, Search } from "lucide-react";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await adminService.users();
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentActive: boolean) => {
    try {
      if (currentActive) {
        await (adminService as any).suspendUser(userId);
      } else {
        await (adminService as any).reactivateUser(userId);
      }
      await loadUsers();
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
          <h1 className="font-display text-2xl font-bold">User Management</h1>
          <p className="mt-1 text-sm text-muted">Search, view and manage registered patients and their subscription status.</p>
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
                <th className="whitespace-nowrap px-6 py-4 font-medium">Role</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Subscription</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Status</th>
                <th className="whitespace-nowrap px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="mt-2">Loading users...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-coral">
                    <ShieldAlert size={24} className="mx-auto mb-2 opacity-50" />
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <User size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No users found.</p>
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
                      <span className="inline-block rounded bg-surface2 px-2 py-1 text-xs font-mono uppercase tracking-wider text-muted border border-border">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="capitalize">{user.subscription || "Free"}</div>
                      <div className="text-xs text-muted">{user.subscription_status || "Active"}</div>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-good">
                          <CheckCircle2 size={14} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-coral">
                          <XCircle size={14} /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                        className={`text-xs font-medium transition-colors ${user.is_active ? "text-coral hover:text-coral/80" : "text-good hover:text-good/80"}`}
                      >
                        {user.is_active ? "Suspend" : "Reactivate"}
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
