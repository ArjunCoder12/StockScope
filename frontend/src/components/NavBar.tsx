import ResponsiveContainer from "../structures/ResponsiveContainer";
import "../styles/NavBar.css";
interface NavBarProps {
  logo: string;
}

export default function NavBar({ logo }: NavBarProps) {
  return (
    <ResponsiveContainer>
      <nav className="nav">
        <a href="/" className="logo">
          <img className="logo__img" src={logo} alt="logo"></img>
          <span className="logo__text">StockScope</span>
        </a>
        <ul className="nav__list">
          <li className="nav__item">
            <a className="nav__link" href="/dashboard">
              Dashboard
            </a>
          </li>
          <li className="nav__item">
            <a className="nav__link" href="/charts">
              Charts
            </a>
          </li>
          <li className="nav__item">
            <a className="nav__link" href="/sentiment">
              Sentiment
            </a>
          </li>
        </ul>
      </nav>
    </ResponsiveContainer>
  );
}
