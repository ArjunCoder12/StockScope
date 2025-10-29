import "./styles/App.css";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./screens/Dashboard";
import TickerPage from "./screens/TickerPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <NavBar logo="/logo.png" />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ticker/:symbol" element={<TickerPage />} />
            <Route
              path="/charts"
              element={<h1>Charts Page - Coming Soon</h1>}
            />
            <Route
              path="/sentiment"
              element={<h1>Sentiment Page - Coming Soon</h1>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
