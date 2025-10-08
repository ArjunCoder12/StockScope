import "./styles/App.css";

import React from "react";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <NavBar logo={""} />
        <Dashboard />
      </div>
    </QueryClientProvider>
  );
}

export default App;
