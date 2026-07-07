import "./Button.css";

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  return (
    <button
      className={`ui-btn ui-btn--${variant} ui-btn--${size} ${loading ? "ui-btn--loading" : ""} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="ui-btn__spinner" aria-hidden="true" />
      )}
      <span className={loading ? "ui-btn__label--hidden" : ""}>{children}</span>
    </button>
  );
}
