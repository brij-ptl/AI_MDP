"use client";

import { useState } from "react";
import { predictionService } from "@/services/prediction.service";
import { reportService } from "@/services/report.service";
import { ArrowRight, Lock } from "lucide-react";
import ClinicalFieldInput from "./ClinicalFieldInput";
import Button from "@/components/ui/Button";
import { ClinicalField } from "@/constants/diseaseQuestions";
import { useTrial } from "@/context/TrialContext";
import { DiseaseMeta } from "@/constants/diseases";

type PredictionResult = {
  prediction_label: string;
  risk_level: string;
  confidence_score: number;
  doctor_explanation: string;
  recommended_tests?: string[];
  recommended_specialist?: string;
};

export default function DiseaseForm({ disease, fields }: { disease: DiseaseMeta; fields: ClinicalField[] }) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLocked, registerPredictionUsed, freeRemaining } = useTrial();

  if (isLocked) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-8 text-center">
        <Lock className="mx-auto text-amber-400" size={32} />
        <h3 className="mt-4 font-display text-xl font-bold">Free predictions used up</h3>
        <p className="mt-2 text-sm text-muted">
          You've used your 2 free predictions. Upgrade to a plan starting at ₹49/month to keep screening.
        </p>
        <Button href="/pricing" className="mt-6">View Plans</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response: any = await predictionService.predict(
        disease.slug,
        {
          features: answers,
          input_type: "manual_form",
        }
      );

      const prediction = response.data.data;

      // Show prediction result
      setResult(prediction);

      // Automatically generate report
      // Count the free prediction
      registerPredictionUsed();

      // Generate the report in the background
      reportService
        .generateReport(prediction.id)
        .catch((err) => {
          console.error("Report generation failed:", err);
        });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
        err?.response?.data?.detail ??
        "Prediction failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="text-sm uppercase tracking-wide text-primary">Prediction Result</p>
        <h3 className="mt-3 font-display text-3xl font-bold">
          {result.risk_level} Risk
        </h3>
        <p className="mt-2 text-lg font-medium text-primary">
          Prediction: {result.prediction_label}
        </p>
        <div className="mx-auto mt-6 h-3 w-full max-w-sm overflow-hidden rounded-full bg-surface2">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            style={{
              width: `${Math.min(
                100,
                Math.max(0, result.confidence_score ?? 0)
              )}%`,
            }}
          />
        </div>
        <p className="mt-2 text-sm text-muted">
          Confidence score: {result.confidence_score}%
        </p>
        {result.recommended_tests && result.recommended_tests.length > 0 && (
          <div className="mt-6 rounded-xl border border-border p-4 text-left">
            <h4 className="font-semibold">Recommended Tests</h4>
            <ul className="mt-3 list-disc pl-5 text-sm text-muted">
              {result.recommended_tests.map((test: string) => (
                <li key={test}>{test}</li>
              ))}
            </ul>
          </div>
        )}
        {result.recommended_specialist && (
          <div className="mt-6 rounded-xl border border-border p-4">
            <h4 className="font-semibold">
              Recommended Specialist
            </h4>

            <p className="mt-2 text-sm text-muted">
              {result.recommended_specialist}
            </p>
          </div>
        )}
        <p className="mx-auto mt-6 max-w-md text-sm text-muted">
          {result.doctor_explanation}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/reports">View / Download Report</Button>
          <Button href="/prediction" variant="outline">Try another module</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted">{freeRemaining} free prediction(s) remaining on your account.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <ClinicalFieldInput
            key={f.id}
            field={f}
            value={answers[f.id]}
            onChange={(v) => setAnswers((a) => ({ ...a, [f.id]: v }))}
          />
        ))}
      </div>
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <Button
        type="submit"
        className="mt-4"
        disabled={loading}
      >
        {loading ? "Running Prediction..." : "Run AI Prediction"}
        {!loading && <ArrowRight size={16} />}
      </Button>
    </form>
  );
}
