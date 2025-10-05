import ChartPanel from "./ChartPanel";
import axios from "axios";
import { useEffect, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import "../styles/Dashboard.css";
import { ArrowTrendingDownIcon } from "@heroicons/react/24/solid";
import ResponsiveContainer from "../structures/ResponsiveContainer";

//yahoo finance and vantage api keys
export default function Dashboard() {
  //Formatting date for stock info section
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //Storing data for each stock when reading in
  interface Stock {
    name: string;
    price: number;
    change: number;
  }

  const [stocks, setStocks] = useState<Stock[]>([]);

  return (
    <ResponsiveContainer
      style={{
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgba(28, 32, 29, 0.44)",
      }}
    >
      <h2>Dashboard</h2>

      <div className="dashboard-grid">
        <StockChartPanel />
        <StockInfoPanel formattedDate={formattedDate} />
        <StockNewsPanel />
        <StockAlertsPanel />
      </div>
    </ResponsiveContainer>
  );
}

/* STOCK CHART PANEL 

CSS classes:
- dashboard-panel

*/
function StockChartPanel() {
  return (
    <div className="dashboard-panel">
      <h3>Chart</h3>
      {/* <ChartPanel title="Example" apiURL="" dataKey="" /> */}
      {/* needs data to work properly */}
    </div>
  );
}

/* STOCK NEWS PANEL 

CSS classes:
- dashboard-panel
- dashboard-news-container
- dashboard-news-details
- dashboard-news-details-image

*/
function StockNewsPanel() {
  return (
    <div className="dashboard-panel">
      <div className="dashboard-news-container">
        <h3>News</h3>

        <div className="dashboard-news-details">
          <div>
            <img
              src="https://placehold.co/600x400"
              alt="news thumbnail"
              className="dashboard-news-details-image"
            />
          </div>
          <div>
            <h4 style={{ fontSize: "16px" }}>Company 2 shares plummet</h4>
            <h5 style={{ fontSize: "14px", color: "#555" }}>
              Stock falls 12% after quarterly earnings report
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

/* STOCK ALERTS PANEL

CSS classes:
- dashboard-panel
- dashboard-alerts
- dashboard-alerts-icon


*/

function StockAlertsPanel() {
  return (
    <div className="dashboard-panel">
      <h3>Alerts</h3>

      <div className="dashboard-alerts">
        <ArrowTrendingDownIcon className="dashboard-alerts-icon" />
        <span>Watch Company 2 stock decline</span>
      </div>
    </div>
  );
}

/* STOCK INFO PANEL 
CSS classes:
- dashboard-panel
- dashboard-stock-info-labels
- dashboard-stock-info-data

*/
function StockInfoPanel({ formattedDate }: { formattedDate: string }) {
  return (
    <div className="dashboard-panel">
      <h3>Stock Info: {formattedDate}</h3>

      {/*Grid layout for stock info section*/}
      <div className="dashboard-stock-info-labels">
        <div>Stock</div>
        <div>Price</div>
        <div>% Change</div>
      </div>

      {/*Example stock data*/}
      <div className="dashboard-stock-info-data">
        {/*Inputting company data*/}
        {/*For future we definitely want to reuse a css class for each one of these*/}
        <div>Company1</div>
        <div>$150.00</div>
        <div style={{ color: "green" }}>+1.5%</div>

        <div>Company2</div>
        <div>$59.00</div>
        <div style={{ color: "red" }}>-3.8%</div>

        <div>Company3</div>
        <div>$90.00</div>
        <div style={{ color: "green" }}>+6.3%</div>

        <div>Company4</div>
        <div>$24.00</div>
        <div style={{ color: "red" }}>-0.2%</div>
      </div>
    </div>
  );
}
