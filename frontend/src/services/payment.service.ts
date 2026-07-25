import { api } from "./api";

export const paymentService = {
  createOrder: (planId: string) => api.post("/payment/create-order", { planId }),
  verify: (payload: Record<string, unknown>) => api.post("/payment/verify", payload),
};
