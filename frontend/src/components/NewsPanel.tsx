import SentimentCard from "./SentimentCard";
import "../styles/Dashboard.css";
import { useNewsData, useAllNewsData } from "../api/hooks/generalHooks";
import { NewsType } from "../api/types";

interface NewsPanelProps {
  ticker?: string; // Make ticker optional
}

export default function NewsPanel({ ticker }: NewsPanelProps) {
  // Use ticker-specific news if ticker is provided, otherwise use all news
  const {
    data: tickerNewsData,
    isLoading: tickerLoading,
    error: tickerError,
  } = useNewsData(ticker || "");

  const {
    data: allNewsData,
    isLoading: allNewsLoading,
    error: allNewsError,
  } = useAllNewsData();

  // Determine which data to use
  const newsData = ticker ? tickerNewsData : allNewsData;
  const isLoading = ticker ? tickerLoading : allNewsLoading;
  const error = ticker ? tickerError : allNewsError;

  if (isLoading) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-news-container">
          <h3>News {ticker ? `- ${ticker}` : ""}</h3>
          <div>Loading news...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-news-container">
          <h3>News {ticker ? `- ${ticker}` : ""}</h3>
          <div>Error loading news. Please try again later.</div>
        </div>
      </div>
    );
  }

  if (!newsData?.data || newsData.data.length === 0) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-news-container">
          <h3>News {ticker ? `- ${ticker}` : ""}</h3>
          <div>No news available at the moment.</div>
        </div>
      </div>
    );
  }

  // Get the first news item to display
  const firstNewsItem: NewsType = newsData.data[0];

  return (
    <div className="dashboard-panel">
      <div className="dashboard-news-container">
        <h3>News {ticker ? `- ${ticker}` : ""}</h3>

        <div className="dashboard-news-details">
          <div>
            <img
              src={firstNewsItem.image || "https://placehold.co/600x400"}
              alt="news thumbnail"
              className="dashboard-news-details-image"
            />
          </div>
          <div>
            <h4 style={{ fontSize: "16px" }}>{firstNewsItem.title}</h4>
            <h5 style={{ fontSize: "14px", color: "#555" }}>
              {firstNewsItem.description}
            </h5>
            <p style={{ fontSize: "12px", color: "#888" }}>
              Last updated:{" "}
              {new Date(firstNewsItem.lastUpdated).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Display sentiment card if sentiment data is available */}
        {firstNewsItem.sentiment && (
          <SentimentCard
            sentiment={firstNewsItem.sentiment}
            confidence={firstNewsItem.confidence.toString()}
            description={`News sentiment for ${firstNewsItem.ticker}`}
            ticker={firstNewsItem.ticker}
            lastUpdated={firstNewsItem.lastUpdated}
            containerProps={{
              justifyContent: "center",
              display: "flex",
            }}
          />
        )}

        {/* Show additional news items if there are more */}
        {newsData.data.length > 1 && (
          <div style={{ marginTop: "16px" }}>
            <h4 style={{ fontSize: "14px", marginBottom: "8px" }}>
              More News ({newsData.data.length - 1} more)
            </h4>
            {newsData.data
              .slice(1, 4)
              .map((newsItem: NewsType, index: number) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "8px",
                    padding: "8px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                  }}
                >
                  <h5 style={{ fontSize: "12px", margin: "0 0 4px 0" }}>
                    {newsItem.title}
                  </h5>
                  <p style={{ fontSize: "10px", color: "#666", margin: "0" }}>
                    {newsItem.ticker} •{" "}
                    {new Date(newsItem.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
