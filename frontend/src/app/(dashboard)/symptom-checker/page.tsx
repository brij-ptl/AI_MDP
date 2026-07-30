"use client";

import { useState } from "react";
import { Send, Sparkles, AlertTriangle } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { useTrial } from "@/context/TrialContext";
import { symptomService } from "@/services/symptom.service";

export default function SymptomCheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLocked, registerPredictionUsed } = useTrial();

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || !text.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response: any = await symptomService.analyze(text);
      setResult(response.data);
      registerPredictionUsed();
    } catch (err: any) {
      setError(err.message || "Failed to analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
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
            {error && <p className="mt-2 text-sm text-coral">{error}</p>}
            <Button type="submit" className="mt-4" disabled={isLocked || loading}>
              {loading ? "Analyzing..." : "Analyze Symptoms"} {!loading && <Send size={16} />}
            </Button>
          </form>

          {result && (
            <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles size={16} /> Possible matches</p>
              
              {result.possible_diseases && result.possible_diseases.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {result.possible_diseases.map((r: any) => (
                    <li key={r.slug} className="text-sm text-muted">
                      • {r.name} ({Math.round(r.confidence * 100)}%)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">No specific condition could be confidently matched.</p>
              )}
              
              {result.next_steps && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-primary">Recommendations</p>
                  <ul className="mt-2 space-y-1">
                    {result.next_steps.map((step: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted">• {step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.doctor_explanation && (
                <div className="mt-8 border-t border-border pt-6">
                  <p className="flex items-center gap-2 text-sm font-semibold text-primary mb-4">
                    <AlertTriangle size={16} /> Comprehensive Clinical Explanation
                  </p>
                  <div className="text-sm text-muted whitespace-pre-line leading-relaxed">
                    {result.doctor_explanation}
                  </div>
                </div>
              )}

              {result.prediction_id && (
                <div className="mt-8 flex justify-center gap-4">
                  <Button href={`/reports/${result.prediction_id}/pdf`}>
                    View / Download Report
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
