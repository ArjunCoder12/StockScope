import "../styles/NavBar.css";
import { useNavigate, Link } from "react-router-dom";
import TickerSearchBar from "./TickerSearchBar";

interface NavBarProps {
  logo: string;
}

// Search bar with autocomplete
const SearchBar = () => {
  const navigate = useNavigate();

  const handleTickerSelect = (ticker: string) => {
    navigate(`/ticker/${ticker.toUpperCase()}`);
  };

  return (
    <TickerSearchBar
      onTickerSelect={handleTickerSelect}
      className="nav__search"
      containerClassName="search-container"
    />
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
