import "../styles/WarningCard.css";

export default function WarningCard({ message }: { message: string }) {
  return (
    <div className="warning-card">
      <h3>{message}</h3>
    </div>
  );
}
