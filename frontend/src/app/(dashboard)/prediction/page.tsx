"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import { DISEASES } from "@/constants/diseases";
import { useTrial } from "@/context/TrialContext";

export default function PredictionListPage() {
  const { isLocked } = useTrial();
  return (
    <>
      <DashboardTopbar title="Disease Prediction" />
      <div className="p-6 lg:p-10">
        <p className="mb-8 max-w-2xl text-sm text-muted">
          Select a condition below. Each module asks the same clinical questions a specialist would use to
          assess your risk, then returns an AI-generated risk score with explainable reasoning.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {DISEASES.map((d) => (
            <Link
              key={d.slug}
              href={`/prediction/${d.slug}`}
              className="relative rounded-2xl border border-border bg-surface p-5 hover:border-primary/50 hover:shadow-glow"
            >
              {isLocked && <Lock size={14} className="absolute right-4 top-4 text-amber-400" />}
              <div className="text-3xl">{d.emoji}</div>
              <h3 className="mt-3 text-sm font-semibold">{d.name}</h3>
              <p className="mt-1 text-xs text-muted">{d.category}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
