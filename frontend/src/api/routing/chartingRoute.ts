import { apiClient } from "../apiClient";

import { PricePoint } from "../types";

interface ChartingResponse {
  data: PricePoint[];
  status: string;
}

export const getCharting = async (
  ticker: string
): Promise<ChartingResponse> => {
  // Uncomment for testing without backend
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({
  //       status: "success",
  //       data: [
  //         { date: "Oct 1", price: 178.25, volume: 45230000 },
  //         { date: "Oct 2", price: 180.5, volume: 48920000 },
  //         { date: "Oct 3", price: 179.85, volume: 42150000 },
  //         { date: "Oct 4", price: 182.1, volume: 51340000 },
  //         { date: "Oct 5", price: 181.75, volume: 46780000 },
  //         { date: "Oct 8", price: 183.4, volume: 49560000 },
  //       ],
  //     });
  //   }, 1000);
  // });

  const response = await apiClient.get(`/api/v1/charting/${ticker}`);
  const data = response.data as ChartingResponse;
  if (data.status === "error") {
    throw new Error();
  }
  return data;
};
