import ChartPanel from "./ChartPanel";
import axios from "axios";
import { useEffect, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

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
    <div>

      <h2>Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr", //Divides columns into two equal parts
          gap: "50px",
          marginTop: "50px",
          height: "500px",
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#efefedff",
            padding: "16px",
          }}
        >
          <h3>Chart</h3>
          {/*<ChartPanel title="Example" apiURL="" dataKey=""/>*/}
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#efefedff",
            padding: "16px",
          }}
        >
          <h3>Stock Info: {formattedDate}</h3>

          {/*Grid layout for stock info section*/}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
              fontWeight: "bold",
              padding: "16px",
            }}
          >
            <div>Stock</div>
            <div>Price</div>
            <div>% Change</div>
          </div>

          {/*Example stock data*/}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            {/*Inputting company data*/}
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

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#efefedff",
            padding: "16px",
          }}
        >
          <h3>News</h3>

          <div
            style={{
              display: "flex",
              alignItems: "left",
              marginBottom: "12px",
            }}
          >
            <img
              src="https://via.placeholder.com/60"
              alt="news thumbnail"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "6px",
              }}
            />
            <div>
              <h4 style={{fontSize: "16px" }}>
                Company 2 shares plummet
              </h4>
              <h5 style={{fontSize: "14px", color: "#555" }}>
                Stock falls 12% after quarterly earnings report
              </h5>
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#efefedff",
            padding: "16px",
          }}
        >
          <h3>Alerts</h3>

          <div className="mt-3 flex items-center gap-10 text-red-600">
            <ArrowTrendingDownIcon
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
            <span>Watch Company 2 stock decline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
