import "../styles/SentimentCard.css";
import ResponsiveContainer from "../structures/ResponsiveContainer";
import { useSentimentData } from "../api/hooks/generalHooks";
import LoadingSpinner from "../structures/LoadingSpinner";

interface SentimentCardProps {
  ticker: string;
}

// Fallback data for testing/api not working
const FALLBACK_SENTIMENT = {
  sentiment: "neutral",
  confidence: 0,
  description: "Sentiment data unavailable. Please try again later.",
  ticker: "",
  lastUpdated: new Date().toLocaleDateString(),
};

export default function SentimentCard({ ticker }: SentimentCardProps) {
  const { data: response, isLoading, error } = useSentimentData(ticker);

  if (isLoading) {
    return (
      <ResponsiveContainer>
        <div className="sentiment-card-loading">
          <LoadingSpinner text="Loading sentiment data..." />
        </div>
      </ResponsiveContainer>
    );
  }

  // Extract sentiment data or use fallback
  const sentimentData = response?.data?.[0] || FALLBACK_SENTIMENT;
  const isUsingFallback = !response?.data?.[0] || error;

  const sentimentClass = getSentimentColor(sentimentData.sentiment);
  const confidence = (sentimentData.confidence * 100).toFixed(0) + "%";
  const description = sentimentData.description;
  const lastUpdated = sentimentData.lastUpdated;

  return (
    <ResponsiveContainer>
      {isUsingFallback && (
        <div className="sentiment-warning">Using demo data</div>
      )}
      <div className={`sentiment-card ${sentimentClass}`}>
        <SentimentHeader ticker={ticker} lastUpdated={lastUpdated} />
        <SentimentBody
          description={description}
          sentiment={sentimentData.sentiment}
        />
        <SentimentFooter confidence={confidence} />
      </div>
    </ResponsiveContainer>
  );
}
//########################################################
// -- Sentiment Header --
interface SentimentHeaderProps {
  ticker: string;
  lastUpdated: string;
}

function SentimentHeader({ ticker, lastUpdated }: SentimentHeaderProps) {
  // Format the date string to be more readable
  const formattedDate = new Date(lastUpdated).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="sentiment-header">
      <h3 className="sentiment-title">
        Sentiment Analysis: <span className="ticker-symbol">{ticker}</span>
      </h3>
      <span className="last-updated">Last Updated: {formattedDate}</span>
    </div>
  );
}
//########################################################
// -- Sentiment Body --
interface SentimentBodyProps {
  description: string;
  sentiment: string;
}

function SentimentBody({ description, sentiment }: SentimentBodyProps) {
  return (
    <div className="sentiment-body">
      <div className="sentiment-badge">{sentiment.toUpperCase()}</div>
      <p className="sentiment-description">{description}</p>
    </div>
  );
}
//########################################################
// -- Sentiment Footer --
interface SentimentFooterProps {
  confidence: string;
}
//########################################################
function SentimentFooter({ confidence }: SentimentFooterProps) {
  return (
    <div className="sentiment-footer">
      <p className="sentiment-confidence">
        Confidence: <span className="confidence-value">{confidence}</span>
      </p>
    </div>
  );
}

//########################################################
// -- Get Sentiment Color --
function getSentimentColor(sentiment: string) {
  const lowerSentiment = sentiment.toLowerCase();
  if (
    lowerSentiment.includes("bullish") ||
    lowerSentiment.includes("positive")
  ) {
    return "bullish";
  } else if (
    lowerSentiment.includes("bearish") ||
    lowerSentiment.includes("negative")
  ) {
    return "bearish";
  } else {
    return "neutral";
  }
}
