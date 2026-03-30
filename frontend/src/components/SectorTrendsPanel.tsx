import "../styles/Dashboard.css";

export default function SectorTrendsPanel() {
  return (
    <div className="dashboard-panel">
      <h3>Sector Trends</h3>

      <div className="dashboard-sector-trends">
        
        {/*Header*/}
        <div className="dashboard-sector-trend-labels">
          <div>Sector</div>
          <div>% Change</div>
        </div>

        {/*Data*/}
        <div className="dashboard-sector-trend-data">
          
          <div className="stock-name">Tech</div>
          <div className="stock-change-positive">+1.3%</div>

          <div className="stock-name">Healthcare</div>
          <div className="stock-change-negative">-0.4%</div>

          <div className="stock-name">Energy</div>
          <div className="stock-change-positive">+2.1%</div>
          

          <div className="stock-name">Finance</div>
          <div className="stock-change-positive">+4.3%</div>

          <div className="stock-name">Utilities</div>
          <div className="stock-change-negative">-2.9%</div>
          
        </div>
      </div>
    </div>
  );
}
