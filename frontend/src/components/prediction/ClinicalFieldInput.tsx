"use client";

import { ClinicalField } from "@/constants/diseaseQuestions";

export default function ClinicalFieldInput({
  field,
  value,
  onChange,
}: {
  field: ClinicalField;
  value: any;
  onChange: (v: any) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface2 p-4">
      <label className="mb-2 block text-sm font-medium text-text">
        {field.label} {field.unit && <span className="text-xs text-muted">({field.unit})</span>}
      </label>
      {field.helper && <p className="mb-2 text-xs text-muted">{field.helper}</p>}

      {field.type === "number" && (
        <input
          type="number"
          step={field.step ?? 1}
          min={field.min}
          max={field.max}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 outline-none focus:border-primary"
          required
        />
      )}

      {field.type === "select" && (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 outline-none focus:border-primary"
          required
        >
          <option value="" disabled>Select an option</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}

      {field.type === "radio" && (
        <div className="flex gap-4">
          {field.options?.map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm text-muted">
              <input
                type="radio"
                name={field.id}
                checked={value === o.value}
                onChange={() => onChange(o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
      )}

      {field.type === "boolean" && (
        <div className="flex gap-4">
          {["Yes", "No"].map((label) => (
            <label key={label} className="flex items-center gap-2 text-sm text-muted">
              <input
                type="radio"
                name={field.id}
                checked={value === (label === "Yes")}
                onChange={() => onChange(label === "Yes")}
              />
              {label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
