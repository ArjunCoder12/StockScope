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

// Static list of popular tickers for autocomplete
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
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "PYPL", name: "PayPal Holdings Inc." },
  { symbol: "UBER", name: "Uber Technologies Inc." },
  { symbol: "SPOT", name: "Spotify Technology S.A." },
  { symbol: "SQ", name: "Block Inc." },
  { symbol: "ZM", name: "Zoom Video Communications" },
  { symbol: "SHOP", name: "Shopify Inc." },
  { symbol: "ROKU", name: "Roku Inc." },
  { symbol: "DOCU", name: "DocuSign Inc." },
];

// Utility functions
const filterTickers = (query: string, tickers: Ticker[]): Ticker[] => {
  if (query.length === 0) return [];

  return tickers
    .filter(
      (ticker) =>
        ticker.symbol.toLowerCase().includes(query.toLowerCase()) ||
        ticker.name.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 8); // Where we can limit how many show
};

// This will be updated in the useSearchBar hook

// Custom hook for search functionality
const useSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Ticker[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update suggestions when search query changes
  useEffect(() => {
    const filteredSuggestions = filterTickers(searchQuery, POPULAR_TICKERS);
    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset search state
  const resetSearch = (): void => {
    setSearchQuery("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  // Handle ticker selection
  const selectTicker = (ticker: string): void => {
    resetSearch();
    navigate(`/ticker/${ticker}`);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Handle input focus
  const handleInputFocus = (): void => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  return {
    searchQuery,
    suggestions,
    showSuggestions,
    selectedIndex,
    searchRef,
    inputRef,
    setSelectedIndex,
    selectTicker,
    handleInputChange,
    handleInputFocus,
  };
};

// Keyboard navigation handler
const useKeyboardNavigation = (
  showSuggestions: boolean,
  suggestions: Ticker[],
  selectedIndex: number,
  setSelectedIndex: (index: number) => void,
  selectTicker: (ticker: string) => void,
  inputRef: React.RefObject<HTMLInputElement | null>
) => {
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(
          selectedIndex < suggestions.length - 1
            ? selectedIndex + 1
            : selectedIndex
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectTicker(suggestions[selectedIndex].symbol);
        }
        break;
      case "Escape":
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  return handleKeyDown;
};

// Search input component
const SearchInput = ({
  searchQuery,
  inputRef,
  handleInputChange,
  handleInputFocus,
  handleKeyDown,
}: {
  searchQuery: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}) => (
  <div className="search-container">
    <input
      ref={inputRef}
      type="text"
      placeholder="Search ticker (e.g., AAPL)"
      value={searchQuery}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onFocus={handleInputFocus}
      className="search-input"
    />
    <div className="search-icon">🔍</div>
  </div>
);

// Suggestions dropdown component
const SuggestionsDropdown = ({
  suggestions,
  selectedIndex,
  showSuggestions,
  onTickerSelect,
  onMouseEnter,
}: {
  suggestions: Ticker[];
  selectedIndex: number;
  showSuggestions: boolean;
  onTickerSelect: (ticker: string) => void;
  onMouseEnter: (index: number) => void;
}) => {
  if (!showSuggestions || suggestions.length === 0) return null;

  return (
    <div className="suggestions-dropdown">
      {suggestions.map((ticker, index) => (
        <div
          key={ticker.symbol}
          className={`suggestion-item ${
            index === selectedIndex ? "selected" : ""
          }`}
          onClick={() => onTickerSelect(ticker.symbol)}
          onMouseEnter={() => onMouseEnter(index)}
        >
          <div className="suggestion-symbol">{ticker.symbol}</div>
          <div className="suggestion-name">{ticker.name}</div>
        </div>
      ))}
    </div>
  );
};

// Main search bar component
const SearchBar = () => {
  const {
    searchQuery,
    suggestions,
    showSuggestions,
    selectedIndex,
    searchRef,
    inputRef,
    setSelectedIndex,
    selectTicker,
    handleInputChange,
    handleInputFocus,
  } = useSearchBar();

  const handleKeyDown = useKeyboardNavigation(
    showSuggestions,
    suggestions,
    selectedIndex,
    setSelectedIndex,
    selectTicker,
    inputRef
  );

  return (
    <div className="nav__search" ref={searchRef}>
      <SearchInput
        searchQuery={searchQuery}
        inputRef={inputRef}
        handleInputChange={handleInputChange}
        handleInputFocus={handleInputFocus}
        handleKeyDown={handleKeyDown}
      />
      <SuggestionsDropdown
        suggestions={suggestions}
        selectedIndex={selectedIndex}
        showSuggestions={showSuggestions}
        onTickerSelect={selectTicker}
        onMouseEnter={setSelectedIndex}
      />
    </div>
  );
};

// Navigation links component
const NavigationLinks = () => (
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
);

// Logo component
const Logo = ({ logo }: { logo: string }) => (
  <Link to="/" className="logo">
    <img className="logo__img" src={logo} alt="logo"></img>
    <span className="logo__text">StockScope</span>
  </Link>
);

// Main NavBar component
export default function NavBar({ logo }: NavBarProps) {
  return (
    <nav className="nav">
      <Logo logo={logo} />
      <SearchBar />
      <NavigationLinks />
    </nav>
  );
}
