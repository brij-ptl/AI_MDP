import { api } from "./api";

export const ocrService = {
  extract: (formData: FormData) =>
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ocr/extract`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((r) => r.json()),
};
