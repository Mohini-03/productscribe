import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "./Pages.css";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main className="placeholder">
        <div className="container placeholder__inner">
          <p className="eyebrow placeholder__eyebrow">Your dashboard</p>
          <h1 className="placeholder__title">
            Every description you've written, in one place
          </h1>
          <p className="placeholder__text">
            This is where you'll generate new product descriptions, revisit
            past ones, and track which listings are ready to publish. The
            dashboard is still a placeholder — the working version will
            connect to your ProductScribe account.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
