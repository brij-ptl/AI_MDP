import { api } from "./api";

export const dashboardService = {
  overview: () => api.get("/dashboard/overview"),
  riskTrend: (disease?: string) =>
    api.get(`/dashboard/risk-trend${disease ? `?disease=${encodeURIComponent(disease)}` : ""}`),
};
