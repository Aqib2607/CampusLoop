import api from "@/lib/api";
import { DashboardStats, User, Report, PaginatedResponse, ApiKey } from "@/lib/types";

export const adminService = {
  getDashboardStats: async (): Promise<{ data: DashboardStats }> => {
    const { data } = await api.get("/admin/dashboard");
    return data;
  },

  getAnalytics: async (): Promise<any> => {
    const { data } = await api.get("/admin/analytics");
    return data;
  },

  getUsers: async (page: number = 1): Promise<PaginatedResponse<User>> => {
    const { data } = await api.get("/admin/users", { params: { page } });
    return data;
  },

  getApiKeys: async (): Promise<{ data: ApiKey[] }> => {
    const { data } = await api.get("/admin/api-keys");
    return data;
  },

  getReports: async (page: number = 1): Promise<PaginatedResponse<Report>> => {
    const { data } = await api.get("/moderator/reports", { params: { page } });
    return data;
  },
};
