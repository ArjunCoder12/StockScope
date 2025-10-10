import React from "react";
import { useParams } from "react-router-dom";
import ChartPanel from "../components/ChartPanel";
import AlertsPanel from "../components/AlertsPanel";
import NewsPanel from "../components/NewsPanel";
import ResponsiveContainer from "../structures/ResponsiveContainer";
import "../styles/Dashboard.css";

export default function TickerPage() {
  const { symbol } = useParams<{ symbol: string }>();

  if (!symbol) {
    return (
      <ResponsiveContainer
        style={{
          textAlign: "center",
          minHeight: "100vh",
          backgroundColor: "rgba(28, 32, 29, 0.44)",
        }}
      >
        <h2>Error</h2>
        <p>No ticker symbol provided</p>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer
      style={{
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgba(28, 32, 29, 0.44)",
      }}
    >
      <h2>{symbol} - Stock Details</h2>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h3>{symbol} Chart</h3>
          <ChartPanel title={`${symbol} Price Chart`} apiURL="" dataKey="" />
        </div>

        <NewsPanel ticker={symbol} />

        <AlertsPanel />
      </div>
    </ResponsiveContainer>
  );
}
