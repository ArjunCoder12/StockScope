import "../styles/WatchlistPanel.css";

import { useWatchlist } from "../api/hooks/generalHooks";
import { WatchlistType } from "../api/types";
import LoadingSpinner from "../structures/LoadingSpinner";
import WarningCard from "./WarningCard";
import { useNavigate } from "react-router-dom";

// Fallback data for testing/api not working
const FALLBACK_WATCHLIST: WatchlistType[] = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "TSLA", name: "Tesla Inc." },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "AMZN", name: "Amazon.com Inc." },
  { ticker: "MSFT", name: "Microsoft Corporation" },
];

export default function WatchlistPanel() {
  const { data: response, isLoading, error } = useWatchlist();

  if (isLoading) {
    return <LoadingWatchlistCard />;
  }

  const watchlistData = response?.data || FALLBACK_WATCHLIST;
  const isUsingFallback: boolean = !response?.data || !!error;

  return (
    <div className="dashboard-panel">
      <h3>My Watchlist</h3>
      {isUsingFallback && <WarningCard message="Using demo data" />}
      <WatchlistGrid stocks={watchlistData} />
    </div>
  );
}

// Loading state component
function LoadingWatchlistCard() {
  return (
    <div className="dashboard-panel">
      <h3>My Watchlist</h3>
      <LoadingSpinner text="Loading watchlist..." />
    </div>
  );
}

// Watchlist grid
function WatchlistGrid({ stocks }: { stocks: WatchlistType[] }) {
  const navigate = useNavigate();

  if (stocks.length === 0) {
    return (
      <div className="watchlist-empty">
        <p>Your watchlist is empty!</p>
        <p className="watchlist-empty-hint">Search for stocks to add them.</p>
      </div>
    );
  }

  return (
    <div className="watchlist-grid">
      {stocks.map((stock) => (
        <WatchlistCard
          key={stock.ticker}
          stock={stock}
          onClick={() => navigate(`/ticker/${stock.ticker}`)}
        />
      ))}
    </div>
  );
}

// Individual watchlist card
function WatchlistCard({
  stock,
  onClick,
}: {
  stock: WatchlistType;
  onClick: () => void;
}) {
  return (
    <div className="watchlist-card" onClick={onClick}>
      <div className="watchlist-card-ticker">{stock.ticker}</div>
      <div className="watchlist-card-name">{stock.name}</div>
    </div>
  );
}
