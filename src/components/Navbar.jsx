import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

const baseLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { seller, logout } = useAuth();
  const navigate = useNavigate();

  // Profile only makes sense once you're signed in.
  const links = seller ? [...baseLinks, { to: "/profile", label: "Profile" }] : baseLinks;

  function handleAuthClick() {
    setOpen(false);
    if (seller) {
      logout();
      navigate("/");
    }
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <svg className="navbar__mark" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M6 26 22 10a4 4 0 0 1 5.7 5.7L11.7 31.7 5 28z"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M19 13l5.7 5.7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>ProductScribe</span>
        </NavLink>

        <nav className={`navbar__links ${open ? "is-open" : ""}`}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"}
              className={({ isActive }) => "navbar__link" + (isActive ? " is-active" : "")}
              onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}

          {/* Dark / light toggle */}
          <button className="navbar__theme-toggle" onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {seller ? (
            <button className="btn btn-primary navbar__cta" onClick={handleAuthClick}>
              Log out
            </button>
          ) : (
            <NavLink to="/login" className="btn btn-primary navbar__cta" onClick={() => setOpen(false)}>
              Log in
            </NavLink>
          )}
        </nav>

        <button className={`navbar__toggle ${open ? "is-open" : ""}`}
          aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}