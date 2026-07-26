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
  platformAnalytics: () => api.get("/analytics/platform"),
  logs: () => api.get("/admin/logs"),
  tokenUsers: (query = "") => api.get<{ success: boolean; data: TokenUser[] }>(`/admin/prediction-tokens${query ? `?query=${encodeURIComponent(query)}` : ""}`),
  updateTokens: (userId: string, payload: { operation: "add" | "remove" | "set" | "reset"; amount?: number; reason?: string }) => api.post<{ success: boolean; data: TokenUser }>(`/admin/prediction-tokens/${userId}`, payload),
  tokenHistory: (userId: string) => api.get<{ success: boolean; data: TokenHistoryItem[] }>(`/admin/prediction-tokens/${userId}/history`),
};
