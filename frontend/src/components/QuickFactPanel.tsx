import "../styles/Dashboard.css";

interface QuickFactPanelProps {
  title: string;
  value: string | number;
}

export default function QuickFactsPanel({ title, value }: QuickFactPanelProps) {
  return (
    <div className="dashboard-panel">
      <h3>{title}</h3>

      {/*Panel content*/}
      <div className="dashboard-sector-trends">
        <p style={{color: "white"}}>{value}</p>
        
      </div>

    </div>
  );
}