import { api } from "./api";

export const symptomService = {
  analyze: (text: string) => api.post("/symptom-checker/analyze", { text }),
};
