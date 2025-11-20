import { apiClient } from "../apiClient";
import { ApiResponse, StockListType } from "../types";

/**
 * Get the list of stocks for a user
 * @returns The list of stocks for a user
 */
export const getStockList = async (): Promise<ApiResponse<StockListType[]>> => {
  const response = await apiClient.get(`/stock-list?limit=10`);
  const data = response.data as ApiResponse<StockListType[]>;
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch stock list");
  }
  return data;
};
