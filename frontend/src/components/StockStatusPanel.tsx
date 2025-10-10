/* STOCK INFO PANEL 
CSS classes:
- dashboard-panel
- dashboard-stock-info-labels
- dashboard-stock-info-data

*/
export default function StockStatusPanel({
  formattedDate,
}: {
  formattedDate: string;
}) {
  return (
    <div className="dashboard-panel">
      <h3>Stock Info: {formattedDate}</h3>

      {/*Grid layout for stock info section*/}
      <div className="dashboard-stock-info-labels">
        <div>Stock</div>
        <div>Price</div>
        <div>% Change</div>
      </div>

      {/*Example stock data*/}
      <div className="dashboard-stock-info-data">
        {/*Inputting company data*/}
        {/*For future we definitely want to reuse a css class for each one of these*/}
        <div>Company1</div>
        <div>$150.00</div>
        <div style={{ color: "green" }}>+1.5%</div>

        <div>Company2</div>
        <div>$59.00</div>
        <div style={{ color: "red" }}>-3.8%</div>

        <div>Company3</div>
        <div>$90.00</div>
        <div style={{ color: "green" }}>+6.3%</div>

        <div>Company4</div>
        <div>$24.00</div>
        <div style={{ color: "red" }}>-0.2%</div>
      </div>
    </div>
  );
}
