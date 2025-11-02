import { apiClient } from "../apiClient";
import { ApiResponse, SentimentType } from "../types";

/**
 * Get sentiment for a given ticker
 * @param ticker - The ticker symbol to get sentiment for
 * @returns The sentiment for the given ticker
 */
export const getSentiment = async (
  ticker: string
): Promise<ApiResponse<SentimentType[]>> => {
  const response = await apiClient.get(`/sentiment/${ticker}`);
  const data = response.data as ApiResponse<SentimentType[]>;
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch sentiment data");
  }
  return data;
};
