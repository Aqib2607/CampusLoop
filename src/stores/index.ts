import { create } from "zustand";
import { User, Listing, PaginatedResponse } from "@/lib/types";
import { removeAuthToken } from "@/lib/api";
import { listingService, GetListingsParams } from "@/services/listing.service";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    removeAuthToken();
    set({ user: null, isAuthenticated: false });
  },
}));

type ListingState = {
  data: PaginatedResponse<Listing> | null;
  isLoading: boolean;
  error: string | null;
  fetchListings: (params?: GetListingsParams) => Promise<void>;
};
export const useListingStore = create<ListingState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchListings: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await listingService.getListings(params);
      set({ data: response, isLoading: false });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch listings";
      set({ error: errorMessage, isLoading: false });
    }
  },
}));

type FavoriteState = {
  ids: number[];
  setIds: (ids: number[]) => void;
  toggle: (id: number) => void;
  has: (id: number) => boolean;
};
export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  ids: [],
  setIds: (ids) => set({ ids }),
  toggle: (id) =>
    set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
  has: (id) => get().ids.includes(id),
}));

type NotifState = {
  unread: number;
  setUnread: (c: number) => void;
  markAllRead: () => void;
};
export const useNotificationStore = create<NotifState>((set) => ({
  unread: 0,
  setUnread: (unread) => set({ unread }),
  markAllRead: () => set({ unread: 0 }),
}));
