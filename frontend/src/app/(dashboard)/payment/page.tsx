"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight, Check, CreditCard, Landmark, QrCode, Receipt, ShieldCheck, Smartphone,
} from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { PLANS } from "@/constants/plans";
import { formatINR } from "@/lib/utils";
import {
  paymentService, type Payment, type PaymentOrder, type SubscriptionPlan,
} from "@/services/payment.service";
import { useAuth } from "@/context/AuthContext";
import { useTrial } from "@/context/TrialContext";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const availablePlans = new Set<SubscriptionPlan>(["starter", "care_plus", "family", "annual"]);

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const { refreshPredictionAccess } = useTrial();
  const requestedPlan = searchParams.get("plan");
  const [plan, setPlan] = useState<SubscriptionPlan>(
    requestedPlan && availablePlans.has(requestedPlan as SubscriptionPlan)
      ? requestedPlan as SubscriptionPlan
      : "care_plus",
  );
  const [history, setHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (requestedPlan && availablePlans.has(requestedPlan as SubscriptionPlan)) {
      setPlan(requestedPlan as SubscriptionPlan);
    }
  }, [requestedPlan]);

  useEffect(() => {
    paymentService.history().then((response) => setHistory(response.data)).catch(() => setHistory([]));
  }, []);

  const selectedPlan = PLANS.find((item) => item.id === plan) ?? PLANS[0];

  const verifyPayment = async (payment: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      await paymentService.verify(payment);
      await refreshUser();
      await refreshPredictionAccess();
      setComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await paymentService.createOrder(plan);
      const order: PaymentOrder = response.data;
      if (!(await loadRazorpay()) || !window.Razorpay) {
        throw new Error("Unable to load secure checkout. Please try again.");
      }
      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Nidaan+",
        description: `${selectedPlan.name} subscription`,
        handler: verifyPayment,
        modal: { ondismiss: () => setLoading(false) },
      });
      checkout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout.");
      setLoading(false);
    }
  };

  if (complete) {
    return <>
      <DashboardTopbar title="Activation Status" />
      <div className="flex min-h-[80vh] items-center justify-center bg-bg p-6 lg:p-10">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-surface p-8 text-center animate-scaleIn">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-green-500 shadow-glow"><Check size={32} /></div>
          <h2 className="font-display text-2xl font-extrabold text-text">Payment Authenticated!</h2>
          <p className="text-sm leading-relaxed text-muted">Your subscription is active and your premium access is ready.</p>
          <Button onClick={() => router.push("/dashboard")} className="w-full">Proceed to Dashboard <ArrowRight size={16} /></Button>
        </div>
      </div>
    </>;
  }

  return <>
    <DashboardTopbar title="Billing Checkout" />
    <div className="min-h-screen space-y-8 bg-bg p-6 pb-24 lg:p-10">
      <div className="grid items-start gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-6 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-sm font-bold text-text">Secure payment</h3>
              <span className="flex items-center gap-1.5 text-xs text-muted"><ShieldCheck size={14} className="text-primary" /> Secured by Razorpay</span>
            </div>
            <div className="grid grid-cols-4 gap-2 border-b border-border/40 pb-4">
              {[
                ["Cards", CreditCard], ["UPI / QR", QrCode], ["Net Bank", Landmark], ["Wallets / EMI", Smartphone],
              ].map(([label, Icon]) => {
                const PaymentIcon = Icon as typeof CreditCard;
                return <div key={label as string} className="flex flex-col items-center justify-center rounded-xl border border-border bg-bg/30 p-3 text-center text-muted"><PaymentIcon size={18} /><span className="mt-1.5 text-[9px] font-bold uppercase tracking-wider">{label as string}</span></div>;
              })}
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Subscription plan</label>
                <select value={plan} onChange={(event) => setPlan(event.target.value as SubscriptionPlan)} className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary">
                  {PLANS.map((item) => <option key={item.id} value={item.id}>{item.name} — {formatINR(item.price)}/{item.period}</option>)}
                </select>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-muted">
                Continue to Razorpay to choose any payment method it supports, including UPI, credit or debit cards, net banking, wallets, and EMI. Nidaan+ does not collect payment credentials.
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="button" onClick={checkout} disabled={loading} className="flex w-full items-center justify-center gap-2 py-4 text-xs font-bold shadow-glow">
                {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-bg border-t-transparent" /> : <>Continue to Razorpay <ArrowRight size={16} /></>}
              </Button>
              <p className="text-center text-[9px] leading-relaxed text-muted">The order amount and currency are created and confirmed by the backend before secure checkout.</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-6 rounded-2xl border border-border bg-surface p-6">
            <h3 className="border-b border-border/60 pb-3 text-sm font-bold text-text">Subscription Details</h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs"><div><p className="font-bold text-text">{selectedPlan.name}</p><p className="text-[10px] text-muted">{selectedPlan.predictionsLimit}</p></div><span className="font-bold text-text">{formatINR(selectedPlan.price)}/{selectedPlan.period}</span></div>
              <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs"><span className="font-bold text-text">Total due today</span><span className="text-base font-extrabold text-primary">{formatINR(selectedPlan.price)}</span></div>
            </div>
          </div>
          <div className="space-y-5 rounded-2xl border border-border bg-surface p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-text"><Receipt size={16} className="text-primary" /> Payment History</h3>
            <div className="space-y-3.5">
              {history.length === 0 ? <p className="text-xs text-muted">No payments yet.</p> : history.map((payment) => <div key={payment.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-bg/25 p-3 text-xs"><div><p className="font-bold text-text">{payment.plan.replace(/_/g, " ")}</p><p className="mt-0.5 text-[9px] text-muted">{new Date(payment.created_at).toLocaleDateString()} · {payment.status}</p></div><span className="font-semibold text-text">{formatINR(payment.amount / 100)}</span></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>;
}
