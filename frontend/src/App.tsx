import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./screens/Dashboard";
import TickerPage from "./screens/TickerPage";
import ChartsPage from "./screens/ChartsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryConfig } from "./api/config/queryConfig";
import ErrorBoundary from "./structures/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: queryConfig.defaultOptions,
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="App">
            <NavBar logo="/logo.png" />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ticker/:symbol" element={<TickerPage />} />
              <Route path="/charts" element={<ChartsPage />} />
              <Route
                path="/sentiment"
                element={<h1>Sentiment Page - Coming Soon</h1>}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
