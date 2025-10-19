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
  // Uncomment for testing without backend
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({
  //       status: "success",
  //       data: [{ sentiment: "positive", confidence: 0.9, description: "The stock is performing well", ticker: "AAPL", lastUpdated: "2024-10-01" }],
  //     });
  //   }, 1000);
  // });
  const response = await apiClient.get(`/api/v1/sentiment/${ticker}`);
  const data = response.data as SentimentResponse;
  if (data.status === "error") {
    throw new Error();
  }
  return data;
};
