import { useQuery } from "@tanstack/react-query";
import { getStockList } from "../routing/stockList";
import {
  STOCK_LIST_KEY,
  CHARTING_DATA_KEY,
  SENTIMENT_DATA_KEY,
  NEWS_DATA_KEY,
} from "../constants";
import { getCharting } from "../routing/chartingRoute";
import { getSentiment } from "../routing/sentimentRoute";
import { getNews } from "../routing/newsRoute";

/**
 * Get the stock list
 * @returns The stock list
 */
export const useStockList = () => {
  return useQuery({
    queryKey: [STOCK_LIST_KEY],
    queryFn: getStockList,
    staleTime: 1000, //10 seconds
  });
};

/**
 * Get the charting data for a given ticker
 * @param ticker - The ticker symbol to get charting data for
 * @returns The charting data for the given ticker
 */
export const useChartingData = (ticker: string) => {
  return useQuery({
    queryKey: [CHARTING_DATA_KEY, ticker], // ← Include ticker
    queryFn: () => getCharting(ticker),
    staleTime: 1000,
    enabled: !!ticker, // ← Only fetch if ticker exists
  });
};

/**
 * Get the sentiment data for a given ticker
 * @param ticker - The ticker symbol to get sentiment data for
 * @returns The sentiment data for the given ticker
 */
export const useSentimentData = (ticker: string) => {
  return useQuery({
    queryKey: [SENTIMENT_DATA_KEY, ticker],
    queryFn: () => getSentiment(ticker),
    staleTime: 2000, //20 seconds
    enabled: !!ticker,
  });
};

export const useNewsData = (ticker: string) => {
  return useQuery({
    queryKey: [NEWS_DATA_KEY, ticker],
    queryFn: () => getNews(ticker),
    staleTime: 2000, //20 seconds
    enabled: !!ticker,
  });
};
