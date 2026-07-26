import { api, getApiUrl } from "./api";

export type Report = {
  id: string;
  prediction_id: string;
  file_name: string;
  download_count: number;
  created_at: string;
};

type ReportsResponse = { success: boolean; data: Report[] };

export const reportService = {
  generateReport: (predictionId: number | string) => api.post(`/reports/generate/${predictionId}`),
  getReports: () => api.get<ReportsResponse>("/reports/"),
  download: (reportId: number | string) => getApiUrl(`/reports/${reportId}/download`),
};
