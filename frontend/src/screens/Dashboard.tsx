import "../styles/Dashboard.css";

import ResponsiveContainer from "../structures/ResponsiveContainer";
import AlertsPanel from "../components/AlertsPanel";
import StockStatusPanel from "../components/StockStatusPanel";
import SectorTrends from "../components/SectorTrendsPanel";
import QuickFactsPanel from "../components/QuickFactPanel";

export default function Dashboard() {
  //Formatting date for stock info section
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ResponsiveContainer
      style={{
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgba(28, 32, 29, 0.44)",
      }}
    >
      <h2 style={{color: "white"}}>Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-panel" style={{ gridArea: "stockstatus" }}>
          <StockStatusPanel formattedDate={formattedDate} />
        </div>

        <div className="dashboard-panel" style={{ gridArea: "sectortrends" }}>
          <SectorTrends />
        </div>

        <div className="dashboard-panel" style={{ gridArea: "quickfacts" }}>
          <QuickFactsPanel title="Market Cap" value="$2.8T" />
          <QuickFactsPanel title="P/E Ratio" value="24.6" />
          <QuickFactsPanel title="Volume" value="1.2M" />
          <QuickFactsPanel title="Dividend Yield" value="1.5%" />
        </div>

        <AlertsPanel />
      </div>
    </ResponsiveContainer>
  );
}

/* STOCK CHART PANEL 

CSS classes:
- dashboard-panel

*/
// function StockChartPanel() {
//   return (
//     <div
//       className="dashboard-panel"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: "1rem",
//       }}
//     >
//       <h3>Chart</h3>
//       <ChartPanel title="Example" apiURL="" dataKey="" />

//       {/* needs data to work properly */}
//     </div>
//   );
// }
