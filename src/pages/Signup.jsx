import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import GoogleButton from "../components/GoogleButton.jsx";
import { Button, Input, ToastContainer, useToast } from "../components/ui/index.js";

import { useAuth } from "../context/AuthContext.jsx";
import "./Pages.css";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, dismissToast } = useToast();

  const [form, setForm] = useState({ businessName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.businessName.trim()) errs.businessName = "Business name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password || form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await signup(form.businessName.trim(), form.email.trim(), form.password);
      // Don't showToast here — this page unmounts the instant navigate() runs,
      // taking its ToastContainer with it before the message could render.
      // Dashboard picks this flag up and shows the message itself instead.
      navigate("/dashboard", { state: { justSignedUp: true } });
    } catch (err) {
      showToast(err.message || "Signup failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="placeholder">
        <div className="container placeholder__inner auth-form-wrap">
          <p className="eyebrow placeholder__eyebrow">Sign up</p>
          <h1 className="placeholder__title">Create your seller account</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Business / shop name"
              value={form.businessName}
              onChange={(e) => setField("businessName", e.target.value)}
              error={errors.businessName}
              placeholder="e.g. Sundar Handicrafts"
              autoComplete="organization"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              error={errors.email}
              placeholder="you@yourshop.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              error={errors.password}
              hint="At least 6 characters"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Button type="submit" loading={submitting} className="auth-form__submit">
              Create account
            </Button>
          </form>

          <div className="auth-divider">or</div>
          <GoogleButton label="Sign up with Google" />

          <p className="auth-form__switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </main>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Footer />
    </>
  );
}