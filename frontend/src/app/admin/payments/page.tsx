"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { CreditCard, ShieldAlert, CheckCircle2, XCircle, Search, Clock } from "lucide-react";

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: any = await adminService.payments();
      if (res && res.data) {
        setPayments(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = payments.filter((p) => 
    p.razorpay_order_id?.toLowerCase().includes(search.toLowerCase()) ||
    p.user_id?.toLowerCase().includes(search.toLowerCase()) ||
    p.plan_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Payment History</h1>
          <p className="mt-1 text-sm text-muted">View all platform transactions and subscription upgrades.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search transactions..."
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
                <th className="whitespace-nowrap px-6 py-4 font-medium">Transaction ID</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">User ID</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Plan</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Amount</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">Status</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="mt-2">Loading transactions...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-coral">
                    <ShieldAlert size={24} className="mx-auto mb-2 opacity-50" />
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    <CreditCard size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No transactions found.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover-card hover:bg-surface2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-text">{payment.razorpay_order_id}</div>
                      <div className="text-xs text-muted">ID: {payment.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-text">{payment.user_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded bg-surface2 px-2 py-1 text-xs font-medium uppercase tracking-wider text-teal border border-border">
                        {payment.plan_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-text">
                      ₹{payment.amount}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === "completed" || payment.status === "paid" ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-good">
                          <CheckCircle2 size={14} /> Completed
                        </span>
                      ) : payment.status === "failed" ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-coral">
                          <XCircle size={14} /> Failed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-amber">
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-muted text-xs">
                      {new Date(payment.created_at).toLocaleString()}
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
