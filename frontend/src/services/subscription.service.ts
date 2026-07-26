import { api } from "./api";

export const subscriptionService = {
  me: () => api.get("/subscription/me"),
};
