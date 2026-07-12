// Links straight to the backend's OAuth kickoff route — this is a normal
// full-page navigation (not a fetch), since the browser needs to follow
// Google's redirect chain and come back with a session cookie / code.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function GoogleButton({ label = "Continue with Google" }) {
  return (
    <a href={`${API_BASE}/auth/google`} className="google-btn">
      <svg className="google-btn__icon" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C33.9 5.5 29.2 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5 44.5 35.3 44.5 24c0-1.2-.1-2.4-.3-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 16 4.5 9.1 8.9 6.3 14.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44.5c5.1 0 9.7-1.9 13.2-5.1l-6.1-5.2c-2 1.4-4.5 2.3-7.1 2.3-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9 40 16 44.5 24 44.5z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.7l6.1 5.2C40.5 36.1 44.5 30.8 44.5 24c0-1.2-.1-2.4-.3-3.5z"
        />
      </svg>
      {label}
    </a>
  );
}