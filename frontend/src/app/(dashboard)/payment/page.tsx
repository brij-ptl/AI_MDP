"use client";
 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { 
  ShieldCheck, CreditCard, QrCode, Smartphone, Landmark, 
  ChevronRight, ArrowRight, Download, Receipt, Sparkles, Check, 
  HelpCircle, Tag, RefreshCw
} from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

export default function PaymentPage() {
  const router = useRouter();
  const [payMethod, setPayMethod] = useState<"card" | "upi" | "netbanking" | "wallet">("card");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  const originalPrice = 149;
  const finalPrice = Math.max(0, originalPrice - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "NIDAAN100") {
      setDiscount(50); // 50 INR discount
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code. Try 'NIDAAN100'.");
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Razorpay/Stripe premium gateway connection
    setTimeout(() => {
      Cookies.set("vitalis_subscribed", "true", { expires: 365 });
      setLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <>
        <DashboardTopbar title="Activation Status" />
        <div className="p-6 lg:p-10 flex items-center justify-center min-h-[80vh] bg-bg">
          <div className="max-w-md w-full rounded-2xl border border-border bg-surface p-8 text-center space-y-6 animate-scaleIn">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 text-green-500 shadow-glow">
              <Check size={32} />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-text">Payment Authenticated!</h2>
            <p className="text-sm text-muted leading-relaxed">
              Your Nidaan+ Care+ subscription has been enabled. The premium star indicator has been added to your profile card.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Proceed to Dashboard <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="Billing Checkout" />
      <div className="p-6 lg:p-10 space-y-8 bg-bg min-h-screen pb-24">
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="font-bold text-text text-sm">Select Payment Method</h3>
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <ShieldCheck size={14} className="text-primary animate-pulse" /> Secured by PCI-DSS
                </span>
              </div>

              {/* Tabs list */}
              <div className="grid grid-cols-4 gap-2 border-b border-border/40 pb-4">
                {[
                  { id: "card", label: "Card", icon: CreditCard },
                  { id: "upi", label: "UPI / QR", icon: QrCode },
                  { id: "netbanking", label: "Net Bank", icon: Landmark },
                  { id: "wallet", label: "Wallets/EMI", icon: Smartphone }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = payMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPayMethod(item.id as any)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        active ? "border-primary bg-primary/5 text-primary" : "border-border bg-bg/30 text-muted hover:text-text"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Forms */}
              <form onSubmit={handlePayment} className="space-y-4">
                {payMethod === "card" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Saved Cards</label>
                      <select className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary">
                        <option className="bg-surface">Add a new credit or debit card</option>
                        <option className="bg-surface">HDFC Visa Credit Card ending in 4920</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Cardholder Name</label>
                      <input type="text" placeholder="John Doe" required className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Card Number</label>
                      <input type="text" placeholder="4111 2222 3333 4444" maxLength={19} required className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary" />
                    </div>
                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Expiration Date</label>
                        <input type="text" placeholder="MM/YY" maxLength={5} required className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted tracking-wider">CVV Code</label>
                        <input type="password" placeholder="•••" maxLength={3} required className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary" />
                      </div>
                    </div>
                  </div>
                )}

                {payMethod === "upi" && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted tracking-wider">UPI ID / VPA</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="username@upi" className="flex-1 rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary" />
                        <Button type="submit" disabled={loading} className="!px-4 !py-3 text-xs">Verify</Button>
                      </div>
                      <p className="text-[10px] text-muted mt-1">Accepts Google Pay, PhonePe, Paytm, BHIM, and other UPI applications.</p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-bg/30 text-center space-y-3">
                      <p className="text-xs font-bold text-text">Scan Dynamic BharatQR Code</p>
                      <div className="relative h-32 w-32 bg-white p-2 rounded-xl border border-border">
                        {/* Simulation of a dynamic clinical checkout QR code */}
                        <div className="h-full w-full bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
                          <QrCode className="text-bg" size={64} />
                        </div>
                      </div>
                      <p className="text-[10px] text-muted">Scan using any dynamic UPI application to complete transactions immediately.</p>
                    </div>
                  </div>
                )}

                {payMethod === "netbanking" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Popular Banks</label>
                      <select className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary cursor-pointer">
                        <option className="bg-surface">State Bank of India (SBI)</option>
                        <option className="bg-surface">HDFC Bank</option>
                        <option className="bg-surface">ICICI Bank</option>
                        <option className="bg-surface">Axis Bank</option>
                        <option className="bg-surface">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {payMethod === "wallet" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Select Wallet</label>
                      <select className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary cursor-pointer">
                        <option className="bg-surface">Paytm Wallet</option>
                        <option className="bg-surface">Amazon Pay</option>
                        <option className="bg-surface">PhonePe Wallet</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Billing Address */}
                <div className="border-t border-border/40 pt-4 mt-6 space-y-4">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wider">Billing Address</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input type="text" placeholder="Address Line 1" required className="w-full rounded-xl border border-border bg-bg/35 px-4 py-2.5 text-xs text-text outline-none focus:border-primary" />
                    <input type="text" placeholder="Postal Code" required className="w-full rounded-xl border border-border bg-bg/35 px-4 py-2.5 text-xs text-text outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading} className="w-full py-4 text-xs font-bold shadow-glow relative overflow-hidden flex items-center justify-center gap-2">
                    {loading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-bg border-t-transparent" />
                    ) : (
                      <>Pay {formatINR(finalPrice)} & Activate Plan</>
                    )}
                  </Button>
                  <p className="text-[9px] text-muted text-center mt-2.5 leading-relaxed">
                    By submitting payment you authorize Nidaan+ to configure auto-renewal terms at {formatINR(finalPrice)}/month. Cancel anytime.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary & Invoices */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm pb-3 border-b border-border/60">Subscription Details</h3>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-text">Care+ Plan</p>
                    <p className="text-[10px] text-muted">Unlimited Screening & Analytics</p>
                  </div>
                  <span className="font-bold text-text">{formatINR(originalPrice)}/mo</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-xs text-green-500 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center border-t border-border/40 pt-3 text-xs">
                  <span className="font-bold text-text">Total due today</span>
                  <span className="text-base font-extrabold text-primary">{formatINR(finalPrice)}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2 border-t border-border/40">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon Code" 
                  disabled={couponApplied}
                  className="flex-1 rounded-xl border border-border bg-bg/50 px-3 py-2 text-xs text-text outline-none focus:border-primary uppercase font-bold" 
                />
                <button 
                  type="submit" 
                  disabled={couponApplied}
                  className="rounded-xl border border-primary text-primary hover:bg-primary hover:text-bg px-4 py-2 text-xs font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  Apply
                </button>
              </form>
              {couponApplied && <p className="text-[10px] text-green-500 font-semibold">Coupon 'NIDAAN100' successfully matched! Save 50 INR.</p>}
            </div>

            {/* Invoices & History */}
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
              <h3 className="font-bold text-text text-sm flex items-center gap-2"><Receipt size={16} className="text-primary" /> Invoice History</h3>
              <div className="space-y-3.5">
                {[
                  { invoice: "INV-2026-003", date: "Jul 24, 2026", amt: "149" },
                  { invoice: "INV-2026-002", date: "Jun 24, 2026", amt: "149" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl border border-border/60 bg-bg/25">
                    <div>
                      <p className="font-bold text-text">{item.invoice}</p>
                      <p className="text-[9px] text-muted mt-0.5">{item.date} · Paid via Card</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-text">{formatINR(Number(item.amt))}</span>
                      <button 
                        onClick={() => alert(`Initiating PDF rendering for ${item.invoice}`)}
                        className="p-1 text-muted hover:text-primary hover:bg-bg rounded transition-all" 
                        aria-label="Download Invoice"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
