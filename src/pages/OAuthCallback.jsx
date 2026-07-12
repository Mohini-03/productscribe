import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Pages.css";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = searchParams.get("token");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError("Google sign-in didn't go through. Please try again.");
      return;
    }
    if (!token) {
      setError("Missing sign-in token. Please try again.");
      return;
    }

    loginWithToken(token)
      .then(() => navigate("/dashboard", { replace: true }))
      .catch(() => setError("We couldn't complete sign-in. Please try again."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <main className="placeholder">
        <div className="container placeholder__inner">
          {error ? (
            <>
              <p className="eyebrow placeholder__eyebrow">Sign-in failed</p>
              <h1 className="placeholder__title">{error}</h1>
              <p>
                <Link to="/login">Back to login</Link>
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow placeholder__eyebrow">One moment</p>
              <h1 className="placeholder__title">Signing you in…</h1>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}