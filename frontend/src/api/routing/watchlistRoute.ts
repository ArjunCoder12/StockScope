import { apiClient } from "../apiClient";
import { ApiResponse, WatchlistType } from "../types";

/**
 * Get the watchlist for a user
 * @returns The watchlist data
 */
export const getWatchlist = async (): Promise<ApiResponse<WatchlistType[]>> => {
  const response = await apiClient.get(`/watchlist`);
  const data = response.data as ApiResponse<WatchlistType[]>;
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch watchlist");
  }
  return data;
};
