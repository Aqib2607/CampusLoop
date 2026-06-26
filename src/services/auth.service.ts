import api from "@/lib/api";
import { User } from "@/lib/types";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },

  register: async (payload: Record<string, unknown>): Promise<LoginResponse> => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  me: async (): Promise<{ success: boolean; data: User }> => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
