import { apiClient } from "../apiClient";

import { WatchlistType } from "../types";

interface WatchlistResponse {
  data: WatchlistType[];
  status: string;
}

/**
 * Get the list of stocks for a user
 * @returns The list of stocks for a user
 */
export const getWatchlist = async (): Promise<WatchlistResponse> => {
  const response = await apiClient.get(`/watchlist`);
  const data = response.data as WatchlistResponse;
  if (data.status === "error") {
    throw new Error();
  }
  return data;
};
