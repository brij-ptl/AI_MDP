import { getApiUrl } from "./api";

export const ocrService = {
  upload: async (file: File, disease?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (disease) formData.append("disease", disease);

    const response = await fetch(getApiUrl("/ocr/upload"), { method: "POST", credentials: "include", body: formData });
    const body = await response.json();
    if (!response.ok) throw new Error(body?.detail ?? body?.message ?? "OCR upload failed.");
    return body as { success: boolean; data: { disease_slug: string | null; extracted_parameters: Record<string, unknown> } };
  },
};
