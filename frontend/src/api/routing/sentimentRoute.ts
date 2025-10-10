import { apiClient } from "../apiClient";
import { SentimentType } from "../types";

//This interface design allows us to control what information is being recieved.
//Rather than guessing, we are explicitly defining the data that is being recieved.so
interface SentimentResponse {
  data: SentimentType[];
  status: string;
}

/**
 * Get sentiment for a given ticker
 * @param ticker - The ticker symbol to get sentiment for
 * @returns The sentiment for the given ticker
 */
export const getSentiment = async (
  ticker: string
): Promise<SentimentResponse> => {
  const response = await apiClient.get(`/sentiment/${ticker}`);
  return response.data as SentimentResponse;
};
