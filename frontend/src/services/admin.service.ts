import { api } from "./api";

export const adminService = {
  users: () => api.get("/admin/users"),
  analytics: () => api.get("/admin/analytics"),
  logs: () => api.get("/admin/logs"),
};
