import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Input, Loader, Modal, ToastContainer, useToast } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Pages.css";

export default function Profile() {
  const { seller, loading: authLoading, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, dismissToast } = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !seller) navigate("/login");
  }, [authLoading, seller, navigate]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function handleDeleteAccount() {
    if (seller.authProvider !== "google" && !password) {
      setPasswordError("Enter your password to confirm");
      return;
    }
    setDeleting(true);
    try {
      await deleteAccount(seller.authProvider === "google" ? undefined : password);
      navigate("/login", { replace: true });
    } catch (err) {
      setPasswordError(err.message || "Couldn't delete account");
      setDeleting(false);
    }
  }

  function closeConfirm() {
    if (deleting) return;
    setConfirmOpen(false);
    setPassword("");
    setPasswordError("");
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

          <div className="danger-zone">
            <p className="danger-zone__title">Danger zone</p>
            <p className="danger-zone__copy">
              Deleting your account permanently removes your profile and every product
              description you've created. This can't be undone.
            </p>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete my account
            </Button>
          </div>
        </div>
      </main>

      <Modal
        isOpen={confirmOpen}
        onClose={closeConfirm}
        title="Delete your account?"
      >
        <p style={{ marginBottom: 16 }}>
          This permanently deletes <strong>{seller.businessName}</strong> and all of its
          product descriptions. This action cannot be undone.
        </p>

        {seller.authProvider !== "google" && (
          <Input
            label="Confirm your password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
            error={passwordError}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        )}
        {seller.authProvider === "google" && passwordError && (
          <p style={{ color: "var(--danger, #c0392b)", fontSize: "0.9rem" }}>{passwordError}</p>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <Button variant="ghost" onClick={closeConfirm} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} loading={deleting}>
            Yes, delete everything
          </Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Footer />
    </>
  );
}