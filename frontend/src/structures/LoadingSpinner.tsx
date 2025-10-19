import "../styles/LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  variant?: "spinner" | "dots" | "pulse";
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = "medium",
  variant = "spinner",
  color,
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerClass = fullScreen
    ? "loading-spinner-container loading-spinner-container--fullscreen"
    : "loading-spinner-container";

  const spinnerClass = `loading-spinner loading-spinner--${size} loading-spinner--${variant}`;

  const style = color ? { borderTopColor: color } : {};

  if (variant === "dots") {
    return (
      <div className={containerClass}>
        <div className={`loading-dots loading-dots--${size}`}>
          <div className="loading-dot" style={{ backgroundColor: color }}></div>
          <div className="loading-dot" style={{ backgroundColor: color }}></div>
          <div className="loading-dot" style={{ backgroundColor: color }}></div>
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={containerClass}>
        <div
          className={`loading-pulse loading-pulse--${size}`}
          style={{ backgroundColor: color }}
        ></div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={spinnerClass} style={style}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}
