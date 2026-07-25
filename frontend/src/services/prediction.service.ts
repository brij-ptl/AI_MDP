import { api } from "./api";

export const predictionService = {
  predict: (disease: string, payload: Record<string, unknown>) => api.post(`/prediction/${disease}`, payload),
};
