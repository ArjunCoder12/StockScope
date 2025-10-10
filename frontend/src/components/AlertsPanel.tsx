/* STOCK ALERTS PANEL

CSS classes:
- dashboard-panel
- dashboard-alerts
- dashboard-alerts-icon


*/

import { ArrowTrendingDownIcon } from "@heroicons/react/24/solid";
import "../styles/Dashboard.css";

export default function AlertsPanel() {
  return (
    <div className="dashboard-panel">
      <h3>Alerts</h3>

      <div className="dashboard-alerts">
        <ArrowTrendingDownIcon className="dashboard-alerts-icon" />
        <span>Watch Company 2 stock decline</span>
      </div>
    </div>
  );
}
