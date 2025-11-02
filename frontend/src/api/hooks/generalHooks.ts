import { useQuery } from "@tanstack/react-query";
import { getStockList } from "../routing/stockList";
import {
  STOCK_LIST_KEY,
  CHARTING_DATA_KEY,
  SENTIMENT_DATA_KEY,
  NEWS_DATA_KEY,
  WATCHLIST_KEY,
} from "../constants";
import { getCharting } from "../routing/chartingRoute";
import { getSentiment } from "../routing/sentimentRoute";
import { getNews } from "../routing/newsRoute";
import { getWatchlist } from "../routing/watchlistRoute";
import { queryConfig } from "../config/queryConfig";

/**
 * Get the stock list
 * @returns The stock list
 */
export const useStockList = () => {
  return useQuery({
    queryKey: [STOCK_LIST_KEY],
    queryFn: getStockList,
    staleTime: queryConfig.staleTime,
    gcTime: queryConfig.gcTime,
  });
};

/**
 * Get the charting data for a given ticker
 * @param ticker - The ticker symbol to get charting data for
 * @returns The charting data for the given ticker
 */
export const useChartingData = (ticker: string) => {
  return useQuery({
    queryKey: [CHARTING_DATA_KEY, ticker],
    queryFn: () => getCharting(ticker),
    staleTime: queryConfig.staleTime,
    gcTime: queryConfig.gcTime,
    enabled: !!ticker,
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
    staleTime: queryConfig.staleTime,
    gcTime: queryConfig.gcTime,
    enabled: !!ticker,
  });
};

/**
 * Get the news data for a given ticker
 * @param ticker - The ticker symbol to get news data for
 * @returns The news data for the given ticker
 */
export const useNewsData = (ticker: string) => {
  return useQuery({
    queryKey: [NEWS_DATA_KEY, ticker],
    queryFn: () => getNews(ticker),
    staleTime: queryConfig.staleTime,
    gcTime: queryConfig.gcTime,
    enabled: !!ticker,
  });
};

/**
 * Get the watchlist data
 * @returns The watchlist data
 */
export const useWatchlist = () => {
  return useQuery({
    queryKey: [WATCHLIST_KEY],
    queryFn: getWatchlist,
    staleTime: queryConfig.staleTime,
    gcTime: queryConfig.gcTime,
  });
};
