// import React, { useEffect, useState } from "react";
// import axios from "axios"; //API calls to get chart data
import {
  // LineChart,
  // Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  ReferenceLine,
  Area,
} from "recharts";

import "../styles/ChartPanel.css";
// import { useChartingData } from "../api/hooks/generalHooks";

//Defining props for ChartPanel component
interface ChartPanelProps {
  title: string;
  apiURL: string;
  dataKey: string;
}
const tempData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function ChartPanel({
  title,
  apiURL,
  dataKey,
}: ChartPanelProps) {
  //React query to get data once available
  // const { data, isLoading, error } = useChartingData(title);
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{title}</h2>

      {/*Displaying x-axis date, y-axis values*/}
      {/* <ResponsiveContainer width="100%" height={300}>
        <LineChart data={tempData}>
          <CartesianGrid strokeDasharray="3 3" />{" "}
          {/*grid lines for better readability*/}
      {/* <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>  */}
      <div className="chart-container">
        <ResponsiveContainer>
          <AreaChart
            data={tempData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
            <ReferenceLine
              y={4000}
              label="Max"
              stroke="red"
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
