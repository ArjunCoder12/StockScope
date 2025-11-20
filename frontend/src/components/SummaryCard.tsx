import "../styles/SummaryCard.css";
import ResponsiveContainer from "../structures/ResponsiveContainer";
import { useSummaryData } from "../api/hooks/generalHooks";
import LoadingSpinner from "../structures/LoadingSpinner";

interface SummaryCardProps {
  ticker: string;
  isUsingDemoData?: boolean; // Optional: indicates if using demo/fallback data
}

// Demo summary data for testing/api not working
const DEMO_SUMMARIES: Record<string, string> = {
  AAPL: "Apple Inc. is a leading technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company is known for its innovative products including the iPhone, iPad, Mac, Apple Watch, and services like the App Store and Apple Music. Apple has a strong brand presence and continues to expand its ecosystem of products and services.",
  TSLA: "Tesla, Inc. is an electric vehicle and clean energy company that designs, develops, manufactures, and sells electric vehicles, energy storage systems, and solar panel manufacturing. The company is a leader in the electric vehicle market and is expanding its production capacity globally. Tesla's mission is to accelerate the world's transition to sustainable energy.",
  MSFT: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through Productivity and Business Processes, Intelligent Cloud, and More Personal Computing segments. Microsoft is a dominant player in enterprise software, cloud computing services, and gaming through its Xbox platform.",
  GOOGL: "Alphabet Inc. is a technology company that provides various products and platforms worldwide. The company operates through Google Services, Google Cloud, and Other Bets segments. Google's services include search, advertising, cloud computing, software, and hardware. The company is a leader in online advertising and cloud infrastructure.",
  AMZN: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally. The company operates through three segments: North America, International, and Amazon Web Services (AWS). Amazon is the world's largest online retailer and a major provider of cloud computing services through AWS.",
};

// Default demo summary for unknown tickers
const DEFAULT_DEMO_SUMMARY =
  "This is a demo summary for the stock. The company operates in its respective industry and provides products and services to customers. Connect to the backend API to see real-time summary data for this ticker.";

/**
 * Get demo summary for a given ticker
 */
function getDemoSummary(ticker: string): string {
  return DEMO_SUMMARIES[ticker.toUpperCase()] || DEFAULT_DEMO_SUMMARY;
}

export default function SummaryCard({
  ticker,
  isUsingDemoData = false,
}: SummaryCardProps) {
  const { data: response, isLoading, error } = useSummaryData(ticker);

  if (isLoading) {
    return (
      <ResponsiveContainer>
        <div className="summary-card-loading">
          <LoadingSpinner text="Loading summary data..." />
        </div>
      </ResponsiveContainer>
    );
  }

  // Extract summary data or use demo data
  const summaryData = response?.data || {
    summary: getDemoSummary(ticker),
    ticker: ticker,
  };
  const isUsingFallback = isUsingDemoData || !response?.data || error;

  return (
    <ResponsiveContainer>
      {isUsingFallback && (
        <div className="summary-warning">Using demo data</div>
      )}
      <div className="summary-card">
        <SummaryHeader ticker={ticker} />
        <SummaryBody summary={summaryData.summary} />
      </div>
    </ResponsiveContainer>
  );
}

//########################################################
// -- Summary Header --
interface SummaryHeaderProps {
  ticker: string;
}

function SummaryHeader({ ticker }: SummaryHeaderProps) {
  return (
    <div className="summary-header">
      <h3 className="summary-title">
        Summary: <span className="ticker-symbol">{ticker}</span>
      </h3>
    </div>
  );
}

//########################################################
// -- Summary Body --
interface SummaryBodyProps {
  summary: string;
}

function SummaryBody({ summary }: SummaryBodyProps) {
  return (
    <div className="summary-body">
      <p className="summary-text">{summary}</p>
    </div>
  );
}

