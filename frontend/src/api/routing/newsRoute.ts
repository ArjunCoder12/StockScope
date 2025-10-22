import { apiClient } from "../apiClient";
import { NewsType } from "../types";

//This interface design allows us to control what information is being recieved.
//Rather than guessing, we are explicitly defining the data that is being recieved.so
interface NewsResponse {
  data: NewsType[];
  status: string;
}

/**
 * Get news for a given ticker
 * @param ticker - The ticker symbol to get news for
 * @returns The news for the given ticker
 */
export const getNews = async (ticker: string): Promise<NewsResponse> => {
  const response = await apiClient.get(`/news/${ticker}`);
  const data = response.data as NewsResponse;
  if (data.status === "error") {
    throw new Error();
  }
  return data;
};
