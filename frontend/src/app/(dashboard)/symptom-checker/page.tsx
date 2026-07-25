"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { useTrial } from "@/context/TrialContext";

export default function SymptomCheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string[] | null>(null);
  const { isLocked, registerPredictionUsed } = useTrial();

  const analyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setResult(["Possible Migraine (62%)", "Tension Headache (48%)", "Dehydration (31%)"]);
    registerPredictionUsed();
  };

  return (
    <>
      <DashboardTopbar title="AI Symptom Checker" />
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-2xl">
          <p className="mb-6 text-sm text-muted">
            Describe how you're feeling in your own words — our NLP engine matches it against a medical
            knowledge base to suggest possible conditions, recommended tests, and next steps.
          </p>
          <form onSubmit={analyze} className="rounded-2xl border border-border bg-surface p-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="e.g. I've had a throbbing headache for two days, sensitivity to light, and mild nausea..."
              className="w-full resize-none rounded-xl border border-border bg-bg p-4 text-sm outline-none focus:border-primary"
            />
            <Button type="submit" className="mt-4" disabled={isLocked}>
              Analyze Symptoms <Send size={16} />
            </Button>
          </form>

          {result && (
            <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles size={16} /> Possible matches</p>
              <ul className="mt-4 space-y-2">
                {result.map((r) => <li key={r} className="text-sm text-muted">• {r}</li>)}
              </ul>
              <p className="mt-4 text-xs text-muted">Recommended: General Physician consultation within 3-5 days.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
