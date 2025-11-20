import { apiClient } from "../apiClient";
import { ApiResponse, PricePoint, IndicatorDataPoint } from "../types";

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

/**
 * Get charting data with technical indicators for a given ticker
 * @param ticker - The ticker symbol to get charting data with indicators for
 * @returns The charting data with indicators for the given ticker
 */
export const getChartingWithIndicators = async (
  ticker: string
): Promise<ApiResponse<IndicatorDataPoint[]>> => {
  const response = await apiClient.get(`/charting/${ticker}/indicators`);
  const data = response.data as ApiResponse<any[]>;
  if (data.status === "error") {
    throw new Error(
      data.message || "Failed to fetch charting data with indicators"
    );
  }

  // Transform backend response to match frontend data structure
  // Convert ISO timestamp to chart date format and map indicator fields
  const transformedData: IndicatorDataPoint[] = (data.data || []).map(
    (item: any) => {
      // Parse ISO timestamp and convert to chart format (e.g., "Jan 1")
      const date = new Date(item.timestamp);
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const day = date.getDate();
      const formattedDate = `${month} ${day}`;

      return {
        date: formattedDate,
        price: item.close || 0,
        close: item.close,
        ema12: item.ema12,
        ema26: item.ema26,
        macd: item.macd,
        signal: item.signal,
        histogram: item.histogram,
        rsi: item.rsi,
        sma20: item.sma20,
        upperBand: item.upperBand,
        lowerBand: item.lowerBand,
      };
    }
  );

  return {
    ...data,
    data: transformedData,
  };
};
