import api from "@/lib/api";
import { Conversation, Message, PaginatedResponse } from "@/lib/types";

export const messagingService = {
  getConversations: async (page: number = 1): Promise<PaginatedResponse<Conversation>> => {
    const { data } = await api.get("/conversations", { params: { page } });
    return data;
  },

  getMessages: async (conversationId: number, page: number = 1): Promise<PaginatedResponse<Message>> => {
    const { data } = await api.get(`/conversations/${conversationId}/messages`, { params: { page } });
    return data;
  },

  sendMessage: async (conversationId: number, content: string): Promise<{ data: Message }> => {
    const { data } = await api.post(`/conversations/${conversationId}/messages`, { content });
    return data;
  },
};
