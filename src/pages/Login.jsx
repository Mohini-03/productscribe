import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import GoogleButton from "../components/GoogleButton.jsx";
import { Button, Input, ToastContainer, useToast } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Pages.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, dismissToast } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      showToast("Welcome back!", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.message || "Login failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="placeholder">
        <div className="container placeholder__inner auth-form-wrap">
          <p className="eyebrow placeholder__eyebrow">Log in</p>
          <h1 className="placeholder__title">Welcome back</h1>

          <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <Button type="submit" loading={submitting} className="auth-form__submit">
              Log in
            </Button>
          </form>

          <div className="auth-divider">or</div>
          <GoogleButton label="Sign in with Google" />

          <p className="auth-form__switch">
            New here? <Link to="/signup">Create a seller account</Link>
          </p>
        </div>
      </main>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Footer />
    </>
  );
}