import { apiClient } from "../apiClient";
import { ApiResponse, NewsType } from "../types";

/**
 * Get news for a given ticker
 * @param ticker - The ticker symbol to get news for
 * @returns The news for the given ticker
 */
export const getNews = async (
  ticker: string
): Promise<ApiResponse<NewsType[]>> => {
  const response = await apiClient.get(`/news/${ticker}`);
  const data = response.data as ApiResponse<NewsType[]>;
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch news");
  }
  return data;
};
