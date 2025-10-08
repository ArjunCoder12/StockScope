import { apiClient } from "../apiClient";

import { ChartingType } from "../types";

interface ChartingResponse {
  data: ChartingType[];
  status: string;
}

export const getCharting = async (
  ticker: string
): Promise<ChartingResponse> => {
  const response = await apiClient.get(`/charting/${ticker}`);
  return response.data as ChartingResponse;
};
