import { api } from "./api";

export const userService = {
  getMe: () => api.get("/users/me"),
  updateMe: (payload: { full_name?: string; phone?: string }) => api.put("/users/me", payload),
  getMedicalProfile: () => api.get("/users/me/medical-profile"),
  saveMedicalProfile: (payload: any) => api.put("/users/me/medical-profile", payload),
  changePassword: (payload: any) => api.post("/users/me/change-password", payload),
};
