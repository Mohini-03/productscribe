import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "./Pages.css";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="placeholder">
        <div className="container placeholder__inner">
          <p className="eyebrow placeholder__eyebrow">About ProductScribe</p>
          <h1 className="placeholder__title">
            Built for the shop owner, not the copywriter
          </h1>
          <p className="placeholder__text">
            This page will share the story behind ProductScribe — why we
            built an AI-powered description generator for small and rural
            businesses, and how it helps sellers who don't have time to
            write polished marketing copy for every product. Full content
            coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}


{/* Routing setup verified */}

