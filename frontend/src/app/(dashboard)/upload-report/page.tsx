"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileCheck2 } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { ocrService } from "@/services/ocr.service";
import { DISEASES } from "@/constants/diseases";

export default function UploadReportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [disease, setDisease] = useState("");
  const [values, setValues] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to extract this report."); }
    finally { setLoading(false); }
  };
  return <><DashboardTopbar title="Upload Medical Report" /><div className="p-6 lg:p-10"><div className="mx-auto max-w-2xl"><p className="mb-6 text-sm text-muted">Upload a PDF or image of your lab report. Our OCR engine extracts key parameters and auto-fills the relevant disease prediction form for you to verify.</p><select value={disease} onChange={(event) => setDisease(event.target.value)} className="mb-4 w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm"><option value="">Choose a disease module for extraction</option>{DISEASES.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select><label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface p-12 text-center hover:border-primary/50"><UploadCloud size={36} className="text-primary" /><p className="mt-4 text-sm font-medium">Click to upload or drag & drop</p><p className="mt-1 text-xs text-muted">PDF, JPG or PNG — up to 10MB</p><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>{file && <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-surface2 p-4"><span className="flex items-center gap-2 text-sm"><FileCheck2 size={16} className="text-primary" /> {file.name}</span><Button onClick={upload} disabled={loading}>{loading ? "Extracting..." : "Run OCR Extraction"}</Button></div>}{error && <p className="mt-4 text-sm text-red-500">{error}</p>}{values && <div className="mt-6 rounded-2xl border border-border bg-surface p-6"><h2 className="font-semibold">Extracted parameters</h2><p className="mt-1 text-sm text-muted">Verify before predicting.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{Object.entries(values).map(([key, value]) => <label key={key} className="text-sm"><span className="mb-1 block text-muted">{key}</span><input value={String(value ?? "")} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2" /></label>)}</div><Button className="mt-6" disabled={!disease} onClick={() => router.push(`/prediction/${disease}?initial=${encodeURIComponent(JSON.stringify(values))}`)}>Verify and predict</Button></div>}</div></div></>;
}
