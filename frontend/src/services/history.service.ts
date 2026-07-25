import { api } from "./api";

export type HistoryParams = {
    disease?: string;
    risk_level?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
};

export const historyService = {
    getHistory: (params?: HistoryParams) => {
        const query = new URLSearchParams(
            Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== "") as [string, string][]
        ).toString();
        return api.get(`/history/${query ? `?${query}` : ""}`);
    },
};