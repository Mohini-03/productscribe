import { NavLink } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">ProductScribe</span>
          <p className="footer__tagline">
            Helping small and rural businesses turn product details into
            descriptions that sell.
          </p>
        </div>

        <div className="footer__col">
          <span className="footer__heading">Product</span>
          <NavLink to="/" className="footer__link">
            Home
          </NavLink>
          <NavLink to="/dashboard" className="footer__link">
            Dashboard
          </NavLink>
          <NavLink to="/login" className="footer__link">
            Log in
          </NavLink>
        </div>

        <div className="footer__col">
          <span className="footer__heading">Company</span>
          <NavLink to="/about" className="footer__link">
            About
          </NavLink>
          <a href="#contact" className="footer__link">
            Contact
          </a>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} ProductScribe. All rights reserved.</p>
      </div>
    </footer>
  );
}
