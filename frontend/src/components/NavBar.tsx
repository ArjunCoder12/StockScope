import "../styles/NavBar.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

interface NavBarProps {
  logo: string;
}

interface Ticker {
  symbol: string;
  name: string;
}

// Popular tickers for autocomplete (users can search ANY ticker)
const POPULAR_TICKERS: Ticker[] = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices" },
  { symbol: "INTC", name: "Intel Corporation" },
];

// Search bar with autocomplete
const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Ticker[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = POPULAR_TICKERS.filter(
      (t) =>
        t.symbol.toLowerCase().includes(query.toLowerCase()) ||
        t.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateToTicker = (ticker: string) => {
    setQuery("");
    setShowSuggestions(false);
    navigate(`/ticker/${ticker.toUpperCase()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        navigateToTicker(suggestions[selectedIndex].symbol);
      } else if (query.trim()) {
        navigateToTicker(query.trim());
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="nav__search" ref={searchRef}>
      <div className="search-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter any ticker (e.g., AAPL, TSLA)"
          value={query}
          onChange={(e) =>
            setQuery(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z]/g, "")
                .slice(0, 5)
            )
          }
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(suggestions.length > 0)}
          className="search-input"
        />
        <div className="search-icon">🔍</div>
      </div>
      {showSuggestions && (
        <div className="suggestions-dropdown">
          {suggestions.map((ticker, idx) => (
            <div
              key={ticker.symbol}
              className={`suggestion-item ${
                idx === selectedIndex ? "selected" : ""
              }`}
              onClick={() => navigateToTicker(ticker.symbol)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className="suggestion-symbol">{ticker.symbol}</div>
              <div className="suggestion-name">{ticker.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main NavBar component
export default function NavBar({ logo }: NavBarProps) {
  return (
    <nav className="nav">
      <Link to="/" className="logo">
        <img className="logo__img" src={logo} alt="StockScope logo" />
        <span className="logo__text">StockScope</span>
      </Link>
      <SearchBar />
      <ul className="nav__list">
        <li className="nav__item">
          <Link className="nav__link" to="/">
            Dashboard
          </Link>
        </li>
        <li className="nav__item">
          <Link className="nav__link" to="/charts">
            Charts
          </Link>
        </li>
        <li className="nav__item">
          <Link className="nav__link" to="/sentiment">
            Sentiment
          </Link>
        </li>
      </ul>
    </nav>
  );
}
