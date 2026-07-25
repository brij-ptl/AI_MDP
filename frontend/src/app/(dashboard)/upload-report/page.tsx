"use client";

import { useState } from "react";
import { UploadCloud, FileCheck2 } from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";

export default function UploadReportPage() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <>
      <DashboardTopbar title="Upload Medical Report" />
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-2xl">
          <p className="mb-6 text-sm text-muted">
            Upload a PDF or image of your lab report. Our OCR engine extracts key parameters and
            auto-fills the relevant disease prediction form for you to verify.
          </p>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface p-12 text-center hover:border-primary/50">
            <UploadCloud size={36} className="text-primary" />
            <p className="mt-4 text-sm font-medium">Click to upload or drag & drop</p>
            <p className="mt-1 text-xs text-muted">PDF, JPG or PNG — up to 10MB</p>
            <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
          </label>

          {fileName && (
            <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-surface2 p-4">
              <span className="flex items-center gap-2 text-sm"><FileCheck2 size={16} className="text-primary" /> {fileName}</span>
              <Button className="!px-4 !py-2 text-xs">Run OCR Extraction</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
