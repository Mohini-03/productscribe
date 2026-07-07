import "./Loader.css";

export default function Loader({ size = "md", fullPage = false, label = "Loading…" }) {
  return (
    <div className={`loader-wrap ${fullPage ? "loader-wrap--full" : ""}`} role="status" aria-label={label}>
      <div className={`loader loader--${size}`} aria-hidden="true" />
      <span className="loader__sr-only">{label}</span>
    </div>
  );
}