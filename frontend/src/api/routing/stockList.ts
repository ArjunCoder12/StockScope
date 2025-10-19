import { apiClient } from "../apiClient";

import { StockListType } from "../types";

interface StockListResponse {
  data: StockListType[];
  status: string;
}

/**
 * Get the list of stocks for a user
 * @returns The list of stocks for a user
 */
export const getStockList = async (): Promise<StockListResponse> => {
  const response = await apiClient.get("/api/v1/stock-list");
  const data = response.data as StockListResponse;
  if (data.status === "error") {
    throw new Error();
  }
  return data;
};
