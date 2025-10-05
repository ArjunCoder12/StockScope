import "../styles/SentimentCard.css";
import ResponsiveContainer from "../structures/ResponsiveContainer";

interface SentimentCardProps {
  sentiment: string;
  confidence: string;
  description: string;
  ticker: string;
  lastUpdated: string;
}

export default function SentimentCard({
  sentiment,
  confidence,
  description,
  ticker,
  lastUpdated,
}: SentimentCardProps) {
  const sentimentClass = getSentimentColor(sentiment);

  return (
    <ResponsiveContainer>
      <div className={`sentiment-card ${sentimentClass}`}>
        <SentimentHeader ticker={ticker} lastUpdated={lastUpdated} />
        <SentimentBody description={description} />
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
  return (
    <div className="sentiment-header">
      <h3 className="sentiment-title">
        Sentiment Analysis: <span className="ticker-symbol">{ticker}</span>
      </h3>
      <span className="last-updated">Last Updated: {lastUpdated}</span>
    </div>
  );
}
//########################################################
// -- Sentiment Body --
interface SentimentBodyProps {
  description: string;
}

function SentimentBody({ description }: SentimentBodyProps) {
  return (
    <div className="sentiment-body">
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
