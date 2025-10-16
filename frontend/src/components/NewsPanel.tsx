import SentimentCard from "./SentimentCard";
import "../styles/Dashboard.css";
import { useNewsData } from "../api/hooks/generalHooks";
import { NewsType } from "../api/types";
import LoadingSpinner from "../structures/LoadingSpinner";
import WarningCard from "./WarningCard";

interface NewsPanelProps {
  ticker: string; // Required: ticker symbol
}

// Fallback data for testing/api not working
const FALLBACK_NEWS: NewsType[] = [
  {
    ticker: "AAPL",
    title: "Demo News: Apple Announces New Product Line",
    description:
      "This is sample news data. Connect to backend to see real news.",
    url: "#",
    image: "https://placehold.co/600x400",
    lastUpdated: new Date().toISOString(),
  },
];

export default function NewsPanel({ ticker }: NewsPanelProps) {
  const { data: response, isLoading, error } = useNewsData(ticker);

  if (isLoading) {
    return <LoadingNewsCard ticker={ticker} />;
  }

  const newsData = response?.data || FALLBACK_NEWS;
  const isUsingFallback = !response?.data || error;

  if (newsData.length === 0) {
    return <NoNewsCard ticker={ticker} />;
  }

  return (
    <div className="dashboard-panel">
      <div className="dashboard-news-container">
        <h3>News - {ticker}</h3>

        {isUsingFallback && <WarningCard message="Using demo data" />}

        <FeaturedNewsItem newsItem={newsData[0]} />

        <div className="dashboard-news-sentiment-container">
          <SentimentCard ticker={ticker} />
        </div>

        {newsData.length > 1 && (
          <AdditionalNewsList newsItems={newsData.slice(1, 4)} />
        )}
      </div>
    </div>
  );
}

// Loading state component
function LoadingNewsCard({ ticker }: { ticker: string }) {
  return (
    <div className="dashboard-panel">
      <div className="dashboard-news-container">
        <h3>News - {ticker}</h3>
        <LoadingSpinner text="Loading news data..." />
      </div>
    </div>
  );
}

// Empty state component
function NoNewsCard({ ticker }: { ticker: string }) {
  return (
    <div className="dashboard-panel">
      <div className="dashboard-news-container">
        <h3>News - {ticker}</h3>
        <div>No news available at the moment.</div>
      </div>
    </div>
  );
}

// Featured news article
function FeaturedNewsItem({ newsItem }: { newsItem: NewsType }) {
  return (
    <div className="dashboard-news-details">
      <div>
        <img
          src={newsItem.image || "https://placehold.co/600x400"}
          alt="news thumbnail"
          className="dashboard-news-details-image"
        />
      </div>
      <div>
        <h4 className="dashboard-news-title">{newsItem.title}</h4>
        <h5 className="dashboard-news-description">{newsItem.description}</h5>
        <p className="dashboard-news-timestamp">
          Last updated: {new Date(newsItem.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// Additional news items list
function AdditionalNewsList({ newsItems }: { newsItems: NewsType[] }) {
  return (
    <div className="dashboard-news-more">
      <h4 className="dashboard-news-more-title">
        More News ({newsItems.length} more)
      </h4>
      {newsItems.map((newsItem, index) => (
        <NewsListItem key={index} newsItem={newsItem} />
      ))}
    </div>
  );
}

// Individual news list item
function NewsListItem({ newsItem }: { newsItem: NewsType }) {
  return (
    <div className="dashboard-news-more-item">
      <h5 className="dashboard-news-more-item-title">{newsItem.title}</h5>
      <p className="dashboard-news-more-item-meta">
        {newsItem.ticker} •{" "}
        {new Date(newsItem.lastUpdated).toLocaleDateString()}
      </p>
    </div>
  );
}
