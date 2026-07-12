import { useState, useCallback } from "react";

// Hook to manage toast state
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    setToasts((prev) => [...prev, { message, type }]);
  }, []);

  const dismissToast = useCallback((index) => {
    setToasts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return { toasts, showToast, dismissToast };
}

// Container to render all active toasts
export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      {toasts.map((t, i) => (
        <div
          key={i}
          style={{
            background: t.type === "error" ? "#c00" : "#333",
            color: "#fff",
            padding: "10px 15px",
            marginTop: "10px",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
          onClick={() => onDismiss(i)}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

