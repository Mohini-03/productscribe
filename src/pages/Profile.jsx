import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Loader } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Pages.css";

export default function Profile() {
  const { seller, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !seller) navigate("/login");
  }, [authLoading, seller, navigate]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (authLoading || !seller) {
    return (
      <>
        <Navbar />
        <main className="placeholder">
          <div className="container placeholder__inner">
            <Loader />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="placeholder">
        <div className="container placeholder__inner auth-form-wrap">
          <p className="eyebrow placeholder__eyebrow">Your account</p>
          <h1 className="placeholder__title">{seller.businessName}</h1>

          <dl className="profile-fields">
            <div className="profile-fields__row">
              <dt>Email</dt>
              <dd>{seller.email}</dd>
            </div>
            <div className="profile-fields__row">
              <dt>Signed up with</dt>
              <dd style={{ textTransform: "capitalize" }}>
                {seller.authProvider === "google" ? "Google" : "Email & password"}
              </dd>
            </div>
            {seller.createdAt && (
              <div className="profile-fields__row">
                <dt>Member since</dt>
                <dd>
                  {new Date(seller.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
            )}
          </dl>

          <Button className="auth-form__submit" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}