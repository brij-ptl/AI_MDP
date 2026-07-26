import { api } from "./api";

export type SubscriptionPlan = "starter" | "care_plus" | "family" | "annual";

export type PaymentOrder = {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  plan: SubscriptionPlan;
};

export type Payment = {
  id: string;
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

export const paymentService = {
  createOrder: (plan: SubscriptionPlan) => api.post<{ success: boolean; data: PaymentOrder }>("/payment/create-order", { plan }),
  verify: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => api.post("/payment/verify", payload),
  history: () => api.get<{ success: boolean; data: Payment[] }>("/payment/history"),
};
