import { useState } from "react";
import ChartPanel from "../components/ChartPanel";
import ResponsiveContainer from "../structures/ResponsiveContainer";
import { useChartingDataWithIndicators } from "../api/hooks/generalHooks";
import LoadingSpinner from "../structures/LoadingSpinner";
import TickerSearchBar from "../components/TickerSearchBar";
import { IndicatorDataPoint } from "../api/types";
import "../styles/ChartsPage.css";

// Fallback indicator data for demo/error cases - shows sharp mountain-climb upward trend
const FALLBACK_INDICATOR_DATA: IndicatorDataPoint[] = [
  {
    date: "Oct 1",
    price: 145.00,
    close: 145.00,
    ema12: 143.5,
    ema26: 141.2,
    macd: 2.3,
    signal: 1.0,
    histogram: 1.3,
    rsi: 42.5,
    sma20: 142.0,
    upperBand: 152.0,
    lowerBand: 132.0,
    volume: 45230000,
  },
  {
    date: "Oct 2",
    price: 152.50,
    close: 152.50,
    ema12: 147.2,
    ema26: 143.1,
    macd: 4.1,
    signal: 2.2,
    histogram: 1.9,
    rsi: 52.8,
    sma20: 145.5,
    upperBand: 158.0,
    lowerBand: 137.0,
    volume: 68920000,
  },
  {
    date: "Oct 3",
    price: 158.75,
    close: 158.75,
    ema12: 151.8,
    ema26: 145.5,
    macd: 6.3,
    signal: 3.8,
    histogram: 2.5,
    rsi: 61.2,
    sma20: 149.8,
    upperBand: 164.5,
    lowerBand: 143.0,
    volume: 72150000,
  },
  {
    date: "Oct 4",
    price: 167.40,
    close: 167.40,
    ema12: 157.5,
    ema26: 148.8,
    macd: 8.7,
    signal: 5.5,
    histogram: 3.2,
    rsi: 68.5,
    sma20: 154.2,
    upperBand: 172.0,
    lowerBand: 150.0,
    volume: 81340000,
  },
  {
    date: "Oct 5",
    price: 175.20,
    close: 175.20,
    ema12: 163.8,
    ema26: 152.5,
    macd: 11.3,
    signal: 7.4,
    histogram: 3.9,
    rsi: 74.2,
    sma20: 159.8,
    upperBand: 180.5,
    lowerBand: 157.5,
    volume: 96780000,
  },
  {
    date: "Oct 8",
    price: 184.60,
    close: 184.60,
    ema12: 171.5,
    ema26: 157.2,
    macd: 14.3,
    signal: 9.6,
    histogram: 4.7,
    rsi: 79.8,
    sma20: 166.5,
    upperBand: 190.0,
    lowerBand: 165.0,
    volume: 109560000,
  },
  {
    date: "Oct 9",
    price: 192.80,
    close: 192.80,
    ema12: 179.8,
    ema26: 162.5,
    macd: 17.3,
    signal: 12.1,
    histogram: 5.2,
    rsi: 83.5,
    sma20: 173.8,
    upperBand: 198.5,
    lowerBand: 173.0,
    volume: 120120000,
  },
  {
    date: "Oct 10",
    price: 201.50,
    close: 201.50,
    ema12: 188.5,
    ema26: 168.2,
    macd: 20.3,
    signal: 14.8,
    histogram: 5.5,
    rsi: 86.2,
    sma20: 181.5,
    upperBand: 207.5,
    lowerBand: 181.0,
    volume: 124890000,
  },
  {
    date: "Oct 11",
    price: 210.75,
    close: 210.75,
    ema12: 197.8,
    ema26: 174.5,
    macd: 23.3,
    signal: 17.8,
    histogram: 5.5,
    rsi: 88.5,
    sma20: 189.8,
    upperBand: 217.0,
    lowerBand: 189.5,
    volume: 142340000,
  },
  {
    date: "Oct 12",
    price: 220.40,
    close: 220.40,
    ema12: 207.5,
    ema26: 181.2,
    macd: 26.3,
    signal: 21.0,
    histogram: 5.3,
    rsi: 90.2,
    sma20: 198.5,
    upperBand: 227.0,
    lowerBand: 198.0,
    volume: 154120000,
  },
  {
    date: "Oct 15",
    price: 231.20,
    close: 231.20,
    ema12: 218.2,
    ema26: 188.5,
    macd: 29.7,
    signal: 24.5,
    histogram: 5.2,
    rsi: 91.8,
    sma20: 208.0,
    upperBand: 238.5,
    lowerBand: 207.5,
    volume: 168760000,
  },
  {
    date: "Oct 16",
    price: 243.50,
    close: 243.50,
    ema12: 230.5,
    ema26: 196.8,
    macd: 33.7,
    signal: 28.2,
    histogram: 5.5,
    rsi: 93.5,
    sma20: 218.5,
    upperBand: 251.0,
    lowerBand: 218.0,
    volume: 181230000,
  },
];

// Empty state component
function EmptyState() {
  return (
    <div className="charts-empty-state">
      <h2>Search for a Stock to View Charts</h2>
      <p>
        Enter a ticker symbol above to see price charts with technical
        indicators
      </p>
    </div>
  );
}

export default function ChartsPage() {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const {
    data: indicatorResponse,
    isLoading,
    error,
  } = useChartingDataWithIndicators(selectedTicker || "");

  return (
    <ResponsiveContainer
      style={{
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgba(28, 32, 29, 0.44)",
        padding: "2rem 1rem",
      }}
    >
      <h1 style={{ color: "white", marginBottom: "2rem" }}>Charts</h1>

      <div className="chart-search-wrapper">
        <TickerSearchBar
          onTickerSelect={setSelectedTicker}
          className="chart-search"
          containerClassName="chart-search-container"
        />
      </div>

      {!selectedTicker ? (
        <EmptyState />
      ) : isLoading ? (
        <div style={{ marginTop: "2rem" }}>
          <LoadingSpinner text="Loading chart data..." />
        </div>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <ChartPanel
            ticker={selectedTicker}
            indicatorData={
              error
                ? FALLBACK_INDICATOR_DATA
                : indicatorResponse?.data || undefined
            }
            isUsingDemoData={!!error}
          />
        </div>
      )}
    </ResponsiveContainer>
  );
}
