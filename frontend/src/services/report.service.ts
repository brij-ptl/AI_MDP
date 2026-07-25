import { api } from "./api";

export const reportService = {
  generateReport: (predictionId: number | string) =>
    api.post(`/reports/generate/${predictionId}`),

  getReports: () =>
    api.get("/reports/"),

  downloadReport: (reportId: number | string) =>
    api.get<Blob>(`/reports/${reportId}/download`),
};