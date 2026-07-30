import { api } from "./api";

export type TokenUser = {
  id: string;
  full_name: string;
  email: string;
  prediction_tokens: number;
  subscription: string;
  subscription_status: string;
  role: string;
  is_active: boolean;
};

export type TokenHistoryItem = {
  id: string;
  admin_id: string;
  target_user_id: string;
  operation: string;
  old_value: number;
  new_value: number;
  reason: string | null;
  created_at: string;
};

export const adminService = {
  users: () => api.get("/admin/users"),
  suspendUser: (userId: string) => api.post(`/admin/users/${userId}/suspend`),
  reactivateUser: (userId: string) => api.post(`/admin/users/${userId}/reactivate`),
  
  diseases: () => api.get("/admin/diseases"),
  disableDisease: (slug: string) => api.post(`/admin/diseases/${slug}/disable`),
  enableDisease: (slug: string) => api.post(`/admin/diseases/${slug}/enable`),
  
  accuracyReports: () => api.get("/admin/models/accuracy-reports"),
  payments: () => api.get("/admin/payments"),
  
  feedback: (status?: string) => api.get(`/admin/feedback${status ? `?status=${status}` : ""}`),
  moderateFeedback: (feedbackId: string, status: string) => api.post(`/admin/feedback/${feedbackId}/status?status=${status}`),
  
  platformAnalytics: () => api.get("/analytics/platform"),
  logs: () => api.get("/admin/logs"),
  
  tokenUsers: (query = "") => api.get<{ success: boolean; data: TokenUser[] }>(`/admin/prediction-tokens${query ? `?query=${encodeURIComponent(query)}` : ""}`),
  updateTokens: (userId: string, payload: { operation: "add" | "remove" | "set" | "reset"; amount?: number; reason?: string }) => api.post<{ success: boolean; data: TokenUser }>(`/admin/prediction-tokens/${userId}`, payload),
  tokenHistory: (userId: string) => api.get<{ success: boolean; data: TokenHistoryItem[] }>(`/admin/prediction-tokens/${userId}/history`),

  reports: () => api.get("/admin/reports"),
  symptomPredictions: () => api.get("/admin/symptom-predictions"),
};
