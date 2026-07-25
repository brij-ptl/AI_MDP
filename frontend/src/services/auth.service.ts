import { api } from "./api";

export const authService = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  register: (
    payload: {
      full_name: string;
      email: string;
      password: string;
      phone?: string;
    }
  ) => api.post("/auth/register", payload),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) => api.post("/auth/reset-password", { token, password }),
};
