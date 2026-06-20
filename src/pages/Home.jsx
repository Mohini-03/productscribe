import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Card from "../components/Card.jsx";
import Footer from "../components/Footer.jsx";
import "./Home.css";

const steps = [
  {
    number: "01",
    title: "Describe your product",
    description:
      "Jot down a few rough details — material, size, price, what makes it special. No need to write full sentences.",
    accent: "sage",
  },
  {
    number: "02",
    title: "Pick a tone",
    description:
      "Choose friendly, professional, or festive, and ProductScribe shapes your words to match how you talk to customers.",
    accent: "saffron",
  },
  {
    number: "03",
    title: "Publish everywhere",
    description:
      "Copy your polished, SEO-friendly description straight into your shop page, marketplace listing, or social post.",
    accent: "coral",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <section className="how-it-works" id="how-it-works">
          <div className="container">
            <p className="eyebrow">How it works</p>
            <h2 className="how-it-works__title">
              Three steps from rough notes to ready-to-sell copy
            </h2>

            <div className="how-it-works__grid">
              {steps.map((step) => (
                <Card
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  accent={step.accent}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
