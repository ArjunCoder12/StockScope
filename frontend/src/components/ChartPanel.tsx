import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import "../styles/ChartPanel.css";
import { useChartingData } from "../api/hooks/generalHooks";
import LoadingSpinner from "../structures/LoadingSpinner";
import { PricePoint } from "../api/types";
import WarningCard from "./WarningCard";

interface ChartPanelProps {
  ticker: string; // Required: which stock to display
}

// Fallback data for testing/api not working
const FALLBACK_DATA: PricePoint[] = [
  { date: "Oct 1", price: 178.25, volume: 45230000 },
  { date: "Oct 2", price: 180.5, volume: 48920000 },
  { date: "Oct 3", price: 179.85, volume: 42150000 },
  { date: "Oct 4", price: 182.1, volume: 51340000 },
  { date: "Oct 5", price: 181.75, volume: 46780000 },
  { date: "Oct 8", price: 183.4, volume: 49560000 },
  { date: "Oct 9", price: 184.2, volume: 50120000 },
  { date: "Oct 10", price: 182.9, volume: 44890000 },
  { date: "Oct 11", price: 185.15, volume: 52340000 },
  { date: "Oct 12", price: 186.5, volume: 54120000 },
  { date: "Oct 15", price: 185.8, volume: 48760000 },
  { date: "Oct 16", price: 187.25, volume: 51230000 },
];

export default function ChartPanel({ ticker }: ChartPanelProps) {
  const { data: response, isLoading, error } = useChartingData(ticker);

  if (isLoading) {
    return <LoadingChartCard ticker={ticker} />;
  }

  const chartData = response?.data || FALLBACK_DATA;
  const isUsingFallback: boolean = !response?.data || !!error;

  return (
    <div>
      <ChartHeader ticker={ticker} showWarning={isUsingFallback} />
      <StockChart data={chartData} />
    </div>
  );
}

// Loading state component
function LoadingChartCard({ ticker }: { ticker: string }) {
  return (
    <div>
      <h2>{`${ticker} Chart`}</h2>
      <div className="chart-container">
        <LoadingSpinner text="Loading chart data..." />
      </div>
    </div>
  );
}

// Chart header with title and optional warning
function ChartHeader({
  ticker,
  showWarning,
}: {
  ticker: string;
  showWarning: boolean;
}) {
  return (
    <>
      <h2>{`${ticker} Chart`}</h2>
      {showWarning && <WarningCard message="Using demo data" />}
    </>
  );
}

// Stock price chart
function StockChart({ data }: { data: PricePoint[] }) {
  return (
    <div className="chart-container">
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <ChartGradient />
          <ChartGrid />
          <ChartAxes />
          <Tooltip />
          <ChartArea />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Gradient definition for chart fill
function ChartGradient() {
  return (
    <defs>
      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1} />
      </linearGradient>
    </defs>
  );
}

// Chart grid
function ChartGrid() {
  return <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />;
}

// Chart axes (X and Y)
function ChartAxes() {
  return (
    <>
      <XAxis dataKey="date" stroke="#888" tick={{ fill: "#888" }} />
      <YAxis
        stroke="#888"
        tick={{ fill: "#888" }}
        tickFormatter={(value) => `$${value}`}
      />
    </>
  );
}

// Chart area component
function ChartArea() {
  return (
    <Area
      type="monotone"
      dataKey="price"
      stroke="#4caf50"
      fill="url(#colorPrice)"
      strokeWidth={2}
    />
  );
}
