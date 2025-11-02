import React from "react";
import "../styles/GridItem.css";

interface GridItemProps {
  children: React.ReactNode;
  /**
   * Named grid area for positioning (must match area name in Grid's `areas` prop).
   * @example "chart", "news", "watchlist"
   */
  area?: string;
  /**
   * CSS grid-column value for direct column positioning.
   * Use when not using named areas. Examples: "1 / 3", "span 2", "2"
   */
  column?: string;
  /**
   * CSS grid-row value for direct row positioning.
   * Use when not using named areas. Examples: "1 / 2", "span 2", "2"
   */
  row?: string;
  /**
   * Visual variant styling.
   * - "panel": Adds panel styling (border, padding, hover effects) - default
   * - "default": No special styling (use when component handles its own styling)
   * @default "panel"
   */
  variant?: "panel" | "default";
  /** Additional CSS classes to apply to the grid item */
  className?: string;
  /** Inline styles to apply to the grid item */
  style?: React.CSSProperties;
}

export default function GridItem({
  children,
  area,
  column,
  row,
  variant = "panel",
  className = "",
  style,
}: GridItemProps) {
  const gridItemStyle: React.CSSProperties = {
    ...(area && { gridArea: area }),
    ...(column && { gridColumn: column }),
    ...(row && { gridRow: row }),
    ...style,
  };

  const classes = `grid-item ${
    variant === "panel" ? "grid-item--panel" : ""
  } ${className}`.trim();

  return (
    <div className={classes} style={gridItemStyle}>
      {children}
    </div>
  );
}
