import "./Input.css";

export default function Input({
  label,
  error,
  hint,
  multiline = false,
  rows = 4,
  className = "",
  id,
  ...rest
}) {
  const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  return (
    <div className={`ui-input-wrap ${error ? "ui-input-wrap--error" : ""} ${className}`}>
      {label && (
        <label className="ui-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          id={inputId}
          className="ui-input ui-input--textarea"
          rows={rows}
          {...rest}
        />
      ) : (
        <input id={inputId} className="ui-input" {...rest} />
      )}
      {error && <p className="ui-input__error">{error}</p>}
      {!error && hint && <p className="ui-input__hint">{hint}</p>}
    </div>
  );
}