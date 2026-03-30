import { apiClient } from "../apiClient";
import { ApiResponse, SummaryType } from "../types";

/**
 * Get summary for a given ticker
 * @param ticker - The ticker symbol to get summary for
 * @returns The summary for the given ticker
 */
export const getSummary = async (
  ticker: string
): Promise<ApiResponse<SummaryType>> => {
  const response = await apiClient.get(`/summary/${ticker}`);
  const data = response.data as ApiResponse<SummaryType>;
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch summary data");
  }
  return data;
};

