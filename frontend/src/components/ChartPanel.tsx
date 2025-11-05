import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
} from "recharts";
import { useState } from "react";

import "../styles/ChartPanel.css";
import "../styles/shared/panel.css";
import { useChartingData } from "../api/hooks/generalHooks";
import LoadingSpinner from "../structures/LoadingSpinner";
import { PricePoint, IndicatorDataPoint } from "../api/types";
import WarningCard from "./WarningCard";

interface ChartPanelProps {
  ticker: string; // Required: which stock to display
  indicatorData?: IndicatorDataPoint[]; // Optional: indicator data to overlay
  isUsingDemoData?: boolean; // Optional: indicates if using demo/fallback data
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

export default function ChartPanel({
  ticker,
  indicatorData,
  isUsingDemoData = false,
}: ChartPanelProps) {
  // Only fetch regular chart data if indicator data is not provided
  const { data: response, isLoading, error } = useChartingData(ticker);
  const [showEMA, setShowEMA] = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [showRSIBollinger, setShowRSIBollinger] = useState(false);

  // If indicator data is provided, skip loading state from regular chart data
  if (isLoading && !indicatorData) {
    return <LoadingChartCard ticker={ticker} />;
  }

  const chartData = response?.data || FALLBACK_DATA;
  const isUsingFallback: boolean =
    isUsingDemoData || (!indicatorData && (!response?.data || !!error));

  // Use indicator data if provided, otherwise use regular chart data
  const dataWithIndicators = indicatorData || chartData;

  return (
    <div className="dashboard-panel">
      <ChartHeader ticker={ticker} showWarning={isUsingFallback} />
      {indicatorData && (
        <IndicatorToggles
          showEMA={showEMA}
          setShowEMA={setShowEMA}
          showMACD={showMACD}
          setShowMACD={setShowMACD}
          showRSIBollinger={showRSIBollinger}
          setShowRSIBollinger={setShowRSIBollinger}
        />
      )}
      <StockChart
        data={dataWithIndicators}
        hasIndicators={!!indicatorData}
        showEMA={showEMA}
        showMACD={showMACD}
        showRSIBollinger={showRSIBollinger}
      />
    </div>
  );
}

// Loading state component
function LoadingChartCard({ ticker }: { ticker: string }) {
  return (
    <div className="dashboard-panel">
      <h3>{`${ticker} Chart`}</h3>
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
      <h3>{`${ticker} Chart`}</h3>
      {showWarning && <WarningCard message="Using demo data" />}
    </>
  );
}

// Indicator toggle controls
function IndicatorToggles({
  showEMA,
  setShowEMA,
  showMACD,
  setShowMACD,
  showRSIBollinger,
  setShowRSIBollinger,
}: {
  showEMA: boolean;
  setShowEMA: (value: boolean) => void;
  showMACD: boolean;
  setShowMACD: (value: boolean) => void;
  showRSIBollinger: boolean;
  setShowRSIBollinger: (value: boolean) => void;
}) {
  return (
    <div className="indicator-toggles">
      <div className="indicator-toggle-group">
        <label className="indicator-toggle-label">
          <input
            type="checkbox"
            checked={showEMA}
            onChange={(e) => setShowEMA(e.target.checked)}
            className="indicator-checkbox"
          />
          <span>EMA (12, 26)</span>
        </label>
        <label className="indicator-toggle-label">
          <input
            type="checkbox"
            checked={showMACD}
            onChange={(e) => setShowMACD(e.target.checked)}
            className="indicator-checkbox"
          />
          <span>MACD</span>
        </label>
        <label className="indicator-toggle-label">
          <input
            type="checkbox"
            checked={showRSIBollinger}
            onChange={(e) => setShowRSIBollinger(e.target.checked)}
            className="indicator-checkbox"
          />
          <span>RSI / Bollinger Bands</span>
        </label>
      </div>
    </div>
  );
}

// Stock price chart
function StockChart({
  data,
  hasIndicators,
  showEMA,
  showMACD,
  showRSIBollinger,
}: {
  data: (PricePoint | IndicatorDataPoint)[];
  hasIndicators: boolean;
  showEMA: boolean;
  showMACD: boolean;
  showRSIBollinger: boolean;
}) {
  const indicatorData = hasIndicators ? (data as IndicatorDataPoint[]) : null;

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
          {hasIndicators && indicatorData && (
            <>
              {/* EMA Lines */}
              {showEMA && (
                <>
                  {indicatorData.some((d) => d.ema12 !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="ema12"
                      stroke="#2196F3"
                      strokeWidth={2}
                      dot={false}
                      name="EMA 12"
                    />
                  )}
                  {indicatorData.some((d) => d.ema26 !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="ema26"
                      stroke="#FF9800"
                      strokeWidth={2}
                      dot={false}
                      name="EMA 26"
                    />
                  )}
                </>
              )}
              {/* MACD Lines */}
              {showMACD && (
                <>
                  {indicatorData.some((d) => d.macd !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="macd"
                      stroke="#9C27B0"
                      strokeWidth={2}
                      dot={false}
                      name="MACD"
                    />
                  )}
                  {indicatorData.some((d) => d.signal !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="signal"
                      stroke="#E91E63"
                      strokeWidth={2}
                      dot={false}
                      name="Signal"
                    />
                  )}
                </>
              )}
              {/* RSI / Bollinger Bands */}
              {showRSIBollinger && (
                <>
                  {indicatorData.some((d) => d.rsi !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="rsi"
                      stroke="#FFC107"
                      strokeWidth={2}
                      dot={false}
                      name="RSI"
                    />
                  )}
                  {indicatorData.some((d) => d.sma20 !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="sma20"
                      stroke="#00BCD4"
                      strokeWidth={2}
                      dot={false}
                      name="SMA 20"
                    />
                  )}
                  {indicatorData.some((d) => d.upperBand !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="upperBand"
                      stroke="#9E9E9E"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Upper Band"
                    />
                  )}
                  {indicatorData.some((d) => d.lowerBand !== undefined) && (
                    <Line
                      type="monotone"
                      dataKey="lowerBand"
                      stroke="#9E9E9E"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Lower Band"
                    />
                  )}
                </>
              )}
            </>
          )}
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
