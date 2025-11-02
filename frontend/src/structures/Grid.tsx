import "../styles/Grid.css";

interface GridProps {
  children: React.ReactNode;
  /**
   * Grid column template (CSS grid syntax).
   * Examples: "1fr 1fr", "repeat(3, 1fr)", "2fr 1fr"
   * @default "1fr 1fr"
   */
  columns?: string;
  /**
   * Grid row template (CSS grid syntax).
   * Examples: "auto auto", "100px auto"
   * @default "auto auto"
   */
  rows?: string;
  /**
   * Named grid areas for positioning items.
   * Each string in the array represents a row, space-separated names are columns.
   * To span multiple columns, repeat the area name: ["header header", "sidebar main"]
   * @example ["stockstatus news", "watchlist watchlist"]
   */
  areas?: string[];
  /**
   * Gap between grid items (CSS gap value).
   * @default "var(--spacing-2xl)"
   */
  gap?: string;
  /**
   * Margin around the grid container (CSS margin value).
   * @default "var(--spacing-5xl) var(--spacing-xl)"
   */
  margin?: string;
  /** Additional CSS classes to apply to the grid container */
  className?: string;
  /**
   * Column template for mobile screens (< 768px).
   * @default "1fr"
   */
  mobileColumns?: string;
  /**
   * Grid areas layout for mobile screens (< 768px).
   * Typically used to stack items vertically.
   * @example ["item1", "item2", "item3"]
   */
  mobileAreas?: string[];
}

export default function Grid({
  children,
  columns = "1fr 1fr",
  rows = "auto auto",
  areas,
  gap = "var(--spacing-2xl)",
  margin = "var(--spacing-5xl) var(--spacing-xl)",
  className = "",
  mobileColumns = "1fr",
  mobileAreas,
}: GridProps) {
  const gridAreasString = areas
    ? areas.map((area) => `"${area}"`).join(" ")
    : undefined;
  const mobileAreasString = mobileAreas
    ? mobileAreas.map((area) => `"${area}"`).join(" ")
    : undefined;

  const style: React.CSSProperties = {
    gridTemplateColumns: columns,
    gridTemplateRows: rows,
    gridTemplateAreas: gridAreasString,
    gap,
    margin,
  };

  if (mobileColumns || mobileAreas) {
    (style as any)["--grid-mobile-columns"] = mobileColumns;
    (style as any)["--grid-mobile-areas"] = mobileAreasString;
  }

  return (
    <div
      className={`grid ${
        mobileAreas || mobileColumns ? "grid--responsive" : ""
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
