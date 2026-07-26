import { api } from "./api";

export type HistoryParams = {
  disease?: string;
  risk_level?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
};

export type HistoryItem = {
  id: string;
  disease_slug: string;
  risk_level: string;
  confidence_score?: number;
  probability?: number;
  created_at: string;
};

export type HistoryResponse = {
  success: boolean;
  data: { items: HistoryItem[]; total: number; limit: number; offset: number };
};

export const historyService = {
  getHistory: (params?: HistoryParams) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, value]) => value !== undefined && value !== "").map(([key, value]) => [key, String(value)])
    ).toString();
    return api.get<HistoryResponse>(`/history/${query ? `?${query}` : ""}`);
  },
};
