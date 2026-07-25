"use client";

import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { PLANS, FREE_TRIAL_LIMIT } from "@/constants/plans";
import { formatINR } from "@/lib/utils";

export default function PricingPage() {
  return (
    <Container className="py-20">
      <SectionHeading
        eyebrow="Pricing"
        title="Healthcare AI, priced for real patients"
        description={`Every account starts with ${FREE_TRIAL_LIMIT} free predictions. No hidden fees, cancel anytime.`}
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
              <h3 className="font-display text-xl font-bold text-text">{plan.name}</h3>
              <p className="mt-2.5 text-xs text-muted min-h-[32px]">{plan.tagline}</p>
              <p className="mt-5 text-4xl font-extrabold text-text">
                {formatINR(plan.price)}
                <span className="text-sm font-medium text-muted">/{plan.period}</span>
              </p>
              <p className="mt-2 text-xs font-semibold text-primary">{plan.predictionsLimit}</p>
 
              <ul className="mt-6 space-y-3.5 border-t border-border/40 pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs text-muted">
                    <Check size={14} className="mt-0.5 shrink-0 text-primary" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
 
            <Button href="/register" variant={plan.highlighted ? "primary" : "outline"} className="mt-8 w-full py-2.5 text-xs font-bold">
              Choose {plan.name}
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        Prices in INR, inclusive of taxes. Need a plan for a clinic or NGO? <a href="/contact" className="text-primary underline">Contact us</a>.
      </p>
    </Container>
  );
}
