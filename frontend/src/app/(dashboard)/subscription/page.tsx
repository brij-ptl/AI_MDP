"use client";
import { Check } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { PLANS } from "@/constants/plans";
import { formatINR } from "@/lib/utils";

export default function SubscriptionPage() {
  return (
    <>
      <DashboardTopbar title="Subscription Upgrade" />
      <div className="p-6 lg:p-10 space-y-6 bg-bg min-h-screen pb-24">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-xs font-bold text-text uppercase tracking-wider">Plan Status</p>
          <p className="text-sm text-muted mt-1">You are currently utilizing the Free Tier credentials (2 screening predictions remaining).</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-4">
          {PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-glow relative"
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-bg shadow-sm">
                  Most Popular
                </span>
              )}
              
              <div>
                <h3 className="font-display text-base font-bold text-text">{plan.name}</h3>
                <p className="mt-2 text-xs text-muted leading-relaxed min-h-[32px]">{plan.tagline}</p>
                <p className="mt-4 text-3xl font-extrabold text-text">
                  {formatINR(plan.price)}
                  <span className="text-xs font-medium text-muted">/{plan.period}</span>
                </p>
                <p className="text-[10px] font-bold text-primary mt-1">{plan.predictionsLimit}</p>
                
                <ul className="mt-6 space-y-3 border-t border-border/40 pt-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted">
                      <Check size={14} className="mt-0.5 shrink-0 text-primary" /> 
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                href="/payment" 
                variant={plan.highlighted ? "primary" : "outline"} 
                className="mt-8 w-full py-2.5 text-xs font-bold"
              >
                Upgrade to {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
