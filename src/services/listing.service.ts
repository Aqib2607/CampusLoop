import api from "@/lib/api";
import { Listing, Category, PaginatedResponse } from "@/lib/types";

export interface GetListingsParams {
  category?: number;
  price_min?: number;
  price_max?: number;
  condition?: string;
  page?: number;
  user_id?: number;
}

export const listingService = {
  getListings: async (params?: GetListingsParams): Promise<PaginatedResponse<Listing>> => {
    const { data } = await api.get("/listings", { params });
    return data;
  },

  getListing: async (id: number): Promise<{ data: Listing }> => {
    const { data } = await api.get(`/listings/${id}`);
    return data;
  },

  getCategories: async (): Promise<{ data: Category[] }> => {
    const { data } = await api.get("/categories");
    return data;
  },

  createListing: async (
    payload: FormData | Record<string, unknown>,
  ): Promise<{ data: Listing }> => {
    // Note: If using FormData (for images), api client handles it.
    const { data } = await api.post("/listings", payload, {
      headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return data;
  },
};
