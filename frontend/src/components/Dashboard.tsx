export default function Dashboard() {
  return (
  
    <div>

      <h2>StockScope</h2>

    <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
          <h3>Module 1: Chart</h3>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
          <h3>Module 2: Stock Info</h3>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
          <h3>Module 3: News</h3>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
          <h3>Module 4: Something Else</h3>
        </div>
      </div>
    </div>
  );
}
