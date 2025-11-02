import { apiClient } from "../apiClient";
import { ApiResponse, PricePoint } from "../types";

/**
 * Get charting data for a given ticker
 * @param ticker - The ticker symbol to get charting data for
 * @returns The charting data for the given ticker
 */
export const getCharting = async (
  ticker: string
): Promise<ApiResponse<PricePoint[]>> => {
  const response = await apiClient.get(`/charting/${ticker}`);
  const data = response.data as ApiResponse<PricePoint[]>;
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch charting data");
  }
  return data;
};
