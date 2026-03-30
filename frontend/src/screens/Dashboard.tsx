import ResponsiveContainer from "../structures/ResponsiveContainer";
import Grid from "../structures/Grid";
import GridItem from "../structures/GridItem";
import StockStatusPanel from "../components/StockStatusPanel";
import NewsPanel from "../components/NewsPanel";
import LoadingSpinner from "../structures/LoadingSpinner";
import { useStockList } from "../api/hooks/generalHooks";
import WatchlistPanel from "../components/WatchlistPanel";

export default function Dashboard() {
  //Formatting date for stock info section
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch stock list (for potential future use)
  const { isLoading, error } = useStockList();

  return (
    <ResponsiveContainer
      style={{
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgba(28, 32, 29, 0.44)",
      }}
    >
      <h2 style={{ color: "white" }}>Dashboard</h2>

      <Grid
        areas={["stockstatus news", "watchlist watchlist"]}
        mobileAreas={["stockstatus", "watchlist", "news"]}
      >
        <GridItem area="stockstatus">
          <StockStatusPanel formattedDate={formattedDate} />
        </GridItem>

        <GridItem area="news">
          {isLoading && <LoadingSpinner text="Loading stocks..." />}
          {error && !isLoading && (
            <>
              <p style={{ color: "white" }}>
                Error loading stocks. Showing default news.
              </p>
              <NewsPanel ticker="AAPL" />
            </>
          )}
          {!isLoading && !error && <NewsPanel ticker="AAPL" />}
        </GridItem>

        <GridItem area="watchlist" className="grid-item--watchlist">
          <WatchlistPanel />
        </GridItem>
      </Grid>
    </ResponsiveContainer>
  );
}
