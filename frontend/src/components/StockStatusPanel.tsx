import { useStockList } from "../api/hooks/generalHooks";
import { StockListType } from "../api/types";
import LoadingSpinner from "../structures/LoadingSpinner";
import WarningCard from "./WarningCard";

interface StockStatusPanelProps {
  formattedDate: string;
}

// Fallback data for testing/api not working
const FALLBACK_STOCKS: StockListType[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 178.25,
    change: 2.5,
    status: "active",
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: 242.8,
    change: -1.2,
    status: "active",
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    price: 378.9,
    change: 0.8,
    status: "active",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: 485.6,
    change: 3.4,
    status: "active",
  },
];

export default function StockStatusPanel({
  formattedDate,
}: StockStatusPanelProps) {
  const { data: response, isLoading, error } = useStockList();

  if (isLoading) {
    return <LoadingStockPanel formattedDate={formattedDate} />;
  }

  const stockData = response?.data || FALLBACK_STOCKS;
  const isUsingFallback: boolean = !response?.data || !!error;

  return (
    <div className="dashboard-panel">
      <h3>Stock Info: {formattedDate}</h3>

      {isUsingFallback && <WarningCard message="Using demo data" />}

      <StockListHeader />
      <StockList stocks={stockData} />
    </div>
  );
}

// Loading state component
function LoadingStockPanel({ formattedDate }: { formattedDate: string }) {
  return (
    <div className="dashboard-panel">
      <h3>Stock Info: {formattedDate}</h3>
      <LoadingSpinner text="Loading stock data..." />
    </div>
  );
}

// Stock list header
function StockListHeader() {
  return (
    <div className="dashboard-stock-info-labels">
      <div>Stock</div>
      <div>Price</div>
      <div>% Change</div>
      <div>News</div>
    </div>
  );
}

// Stock list
function StockList({ stocks }: { stocks: StockListType[] }) {
  return (
    <div className="dashboard-stock-info-data">
      {stocks.map((stock) => (
        <StockRow key={stock.ticker} stock={stock} />
      ))}
    </div>
  );
}

// Individual stock row
function StockRow({ stock }: { stock: StockListType }) {
  const changeColor =
    stock.change >= 0 ? "stock-change-positive" : "stock-change-negative";
  const changeSign = stock.change >= 0 ? "+" : "";

  return (
    <>
      <div className="stock-name">{stock.name}</div>
      <div className="stock-price">${stock.price.toFixed(2)}</div>
      <div className={changeColor}>
        {changeSign}
        {stock.change.toFixed(1)}%
      </div>
      <div className="stock-news">No News Yet</div>
    </>
  );
}
