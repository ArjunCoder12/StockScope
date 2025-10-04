import "../styles/ResponsiveContainer.css";

export default function ResponsiveContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className="responsive-container">
      <div className="responsive-container__content" style={style}>
        {children}
      </div>
    </div>
  );
}
