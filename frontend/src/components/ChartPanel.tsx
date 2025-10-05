import React, { useEffect, useState } from "react";
import axios from "axios"; //API calls to get chart data

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

//Defining props for ChartPanel component
interface ChartPanelProps {
  title: string;
  apiURL: string;
  dataKey: string;
}

export default function ChartPanel( {title, apiURL, dataKey}: ChartPanelProps) {

  const [data, setData] = useState([]);

  //Fetching data from API
  useEffect(() => {

    axios.get(apiURL).then((response) => setData(response.data)); //import yahoo finance api data

  }, [apiURL]);
  
  return (
    <div>
      <h2>{title}</h2>

      {/*Displaying x-axis date, y-axis values*/}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" /> {/*grid lines for better readability*/}
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      
    </div>
  );
}
