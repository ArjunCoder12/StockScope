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

/**
 * Get the stock list
 * @returns The stock list
 */
export const useStockList = () => {
  return useQuery({
    queryKey: [STOCK_LIST_KEY],
    queryFn: getStockList,
    staleTime: 60000, // 60 seconds (1 minute)
    gcTime: 300000, // 300 seconds (5 minutes)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
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
    staleTime: 60000, // 60 seconds (1 minute)
    gcTime: 300000, // 300 seconds (5 minutes)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
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
    staleTime: 60000, // 60 seconds (1 minute)
    gcTime: 300000, // 300 seconds (5 minutes)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    enabled: !!ticker,
  });
};

export const useNewsData = (ticker: string) => {
  return useQuery({
    queryKey: [NEWS_DATA_KEY, ticker],
    queryFn: () => getNews(ticker),
    staleTime: 60000, // 60 seconds (1 minute)
    gcTime: 300000, // 300 seconds (5 minutes)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    enabled: !!ticker,
  });
};

export const useWatchlist = () => {
  return useQuery({
    queryKey: [WATCHLIST_KEY],
    queryFn: getWatchlist,
    staleTime: 60000, // 60 seconds (1 minute)
    gcTime: 300000, // 300 seconds (5 minutes)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
  });
};
