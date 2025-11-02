import { useParams } from "react-router-dom";
import ChartPanel from "../components/ChartPanel";
import NewsPanel from "../components/NewsPanel";
import ResponsiveContainer from "../structures/ResponsiveContainer";
import Grid from "../structures/Grid";
import GridItem from "../structures/GridItem";

export default function TickerPage() {
  const { symbol } = useParams<{ symbol: string }>();

  if (!symbol) {
    return (
      <ResponsiveContainer
        style={{
          textAlign: "center",
          minHeight: "100vh",
          backgroundColor: "rgba(28, 32, 29, 0.44)",
        }}
      >
        <h2>Error</h2>
        <p>No ticker symbol provided</p>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer
      style={{
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgba(28, 32, 29, 0.44)",
      }}
    >
      <h2 style={{ color: "white" }}>{symbol} - Stock Details</h2>

      <Grid areas={["chart news"]} mobileAreas={["chart", "news"]}>
        <GridItem area="chart">
          <ChartPanel ticker={symbol} />
        </GridItem>

        <GridItem area="news">
          <NewsPanel ticker={symbol} />
        </GridItem>
      </Grid>
    </ResponsiveContainer>
  );
}
