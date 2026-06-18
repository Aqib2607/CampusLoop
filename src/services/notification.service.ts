import api from "@/lib/api";
import { Notification, PaginatedResponse } from "@/lib/types";

export const notificationService = {
  getNotifications: async (page: number = 1): Promise<PaginatedResponse<Notification>> => {
    const { data } = await api.get("/notifications", { params: { page } });
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post("/notifications/read-all");
  },
};
