"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileCheck2, ArrowRight } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { ocrService } from "@/services/ocr.service";
import { predictionService } from "@/services/prediction.service";
import { reportService } from "@/services/report.service";
import { useTrial } from "@/context/TrialContext";
import { DISEASES } from "@/constants/diseases";

export default function UploadReportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [disease, setDisease] = useState("");
  const [values, setValues] = useState<Record<string, unknown> | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState("");
  const { isLocked, registerPredictionUsed } = useTrial();

  const upload = async () => {
    if (!file) return;
    if (!disease) {
      setError("Please select a disease module before running OCR extraction.");
      return;
    }
    setLoading(true); setError("");
    try { 
      const response = await ocrService.upload(file, disease || undefined); 
      setValues(response.data.extracted_parameters); 
      if (response.data.disease_slug) setDisease(response.data.disease_slug);
    } catch (err) { 
      setError(err instanceof Error ? err.message : "Unable to extract this report."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handlePredict = async () => {
    if (!disease || !values || isLocked) return;
    setPredicting(true);
    setError("");

    try {
      const response: any = await predictionService.predict(disease, {
        features: values,
        input_type: "ocr",
      });
      const prediction = response.data;
      await reportService.generateReport(prediction.id);
      registerPredictionUsed();
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed.");
    } finally {
      setPredicting(false);
    }
  };

  return (
    <>
      <DashboardTopbar title="Upload Medical Report" />
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-2xl">
          {result ? (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center animate-fadeIn">
              <p className="text-sm uppercase tracking-wide text-primary">Prediction Result</p>
              <h3 className="mt-3 font-display text-3xl font-bold">{result.risk_level} Risk</h3>
              <p className="mt-2 text-lg font-medium text-primary">Prediction: {result.prediction_label}</p>
              <div className="mx-auto mt-6 h-3 w-full max-w-sm overflow-hidden rounded-full bg-surface2">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${Math.min(100, Math.max(0, result.confidence_score ?? 0))}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted">Confidence score: {result.confidence_score}%</p>
              <p className="mx-auto mt-6 max-w-3xl whitespace-pre-line text-left text-sm leading-6 text-muted">
                {result.doctor_explanation}
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button href="/reports">View / Download Report</Button>
                <Button onClick={() => { setValues(null); setResult(null); setFile(null); }} variant="outline">Analyze another report</Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted">
                Upload a PDF or image of your lab report. Our OCR engine extracts key parameters and auto-fills the relevant disease prediction form for you to verify.
              </p>
              <select value={disease} onChange={(e) => setDisease(e.target.value)} className="mb-4 w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-primary">
                <option value="">Choose a disease module for extraction</option>
                {DISEASES.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              
              {!values && (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface p-12 text-center hover:border-primary/50 transition-colors">
                  <UploadCloud size={36} className="text-primary" />
                  <p className="mt-4 text-sm font-medium">Click to upload or drag & drop</p>
                  <p className="mt-1 text-xs text-muted">PDF, JPG or PNG — up to 10MB</p>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              )}
              
              {file && !values && (
                <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-surface2 p-4">
                  <span className="flex items-center gap-2 text-sm"><FileCheck2 size={16} className="text-primary" /> {file.name}</span>
                  <Button onClick={upload} disabled={loading}>{loading ? "Extracting..." : "Run OCR Extraction"}</Button>
                </div>
              )}
              
              {error && <p className="mt-4 text-sm text-coral">{error}</p>}
              
              {values && (
                <div className="mt-6 rounded-2xl border border-border bg-surface p-6 animate-fadeIn">
                  <h2 className="font-semibold text-text">Extracted parameters</h2>
                  <p className="mt-1 text-sm text-muted">Verify before predicting.</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {Object.entries(values).map(([key, value]) => (
                      <label key={key} className="text-sm">
                        <span className="mb-1 block text-muted">{key}</span>
                        <input 
                          value={String(value ?? "")} 
                          onChange={(e) => setValues((current) => ({ ...current, [key]: e.target.value }))} 
                          className="w-full rounded-lg border border-border bg-bg px-3 py-2 outline-none focus:border-primary transition-colors" 
                        />
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <Button variant="outline" onClick={() => { setValues(null); setFile(null); }}>Cancel</Button>
                    <Button disabled={!disease || predicting || isLocked} onClick={handlePredict}>
                      {predicting ? "Running Prediction..." : "Run AI Prediction"} {!predicting && <ArrowRight size={16} />}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
