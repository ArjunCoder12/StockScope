import React from "react";
import "../styles/ErrorDisplay.css";
import WarningCard from "./WarningCard";

interface ErrorDisplayProps {
  /** Error message to display */
  message?: string;
  /** Whether to show retry button */
  showRetry?: boolean;
  /** Callback function when retry is clicked */
  onRetry?: () => void;
  /** Custom title for the error */
  title?: string;
  /** Additional className for styling */
  className?: string;
}

/**
 * Centralized error display component
 * Provides consistent error messaging and optional retry functionality
 */
export default function ErrorDisplay({
  message = "Failed to load data. Please try again later.",
  showRetry = false,
  onRetry,
  title = "Error",
  className = "",
}: ErrorDisplayProps) {
  return (
    <div className={`error-display ${className}`}>
      <WarningCard message={`${title}: ${message}`} />
      {showRetry && onRetry && (
        <button className="error-display__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
