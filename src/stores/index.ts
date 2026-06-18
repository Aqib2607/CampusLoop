import { create } from "zustand";
import { listings as mockListings, type Listing } from "@/lib/mock-data";

type User = { id: string; name: string; email: string; avatar?: string; role: "user" | "moderator" | "admin" } | null;

type AuthState = {
  user: User;
  login: (email: string) => void;
  logout: () => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  user: { id: "me", name: "Jordan Lee", email: "jordan@uni.edu", avatar: "https://i.pravatar.cc/100?img=8", role: "user" },
  login: (email) => set({ user: { id: "me", name: "Jordan Lee", email, role: "user" } }),
  logout: () => set({ user: null }),
}));

type ListingState = {
  listings: Listing[];
  addListing: (l: Listing) => void;
};
export const useListingStore = create<ListingState>((set) => ({
  listings: mockListings,
  addListing: (l) => set((s) => ({ listings: [l, ...s.listings] })),
}));

type FavoriteState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};
export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  ids: ["l1", "l4", "l7"],
  toggle: (id) =>
    set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
  has: (id) => get().ids.includes(id),
}));

type NotifState = { unread: number; markAllRead: () => void };
export const useNotificationStore = create<NotifState>((set) => ({
  unread: 2,
  markAllRead: () => set({ unread: 0 }),
}));
