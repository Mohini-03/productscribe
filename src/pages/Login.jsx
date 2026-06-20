import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "./Pages.css";

export default function Login() {
  return (
    <>
      <Navbar />
      <main className="placeholder">
        <div className="container placeholder__inner">
          <p className="eyebrow placeholder__eyebrow">Log in</p>
          <h1 className="placeholder__title">Welcome back</h1>
          <p className="placeholder__text">
            The login form will live here — email and password fields,
            sign-in, and a link to create a new account. For now this page
            is a placeholder that confirms the route, Navbar, and Footer are
            wired up correctly.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
