import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">AI-powered product copy</p>
          <h1 className="hero__title">
            Write it once.
            <br />
            Sell it everywhere.
          </h1>
          <p className="hero__subtitle">
            Type a few rough details about what you're selling and
            ProductScribe turns them into a polished, SEO-friendly
            description — ready for your shop, your marketplace listing, or
            your next social post.
          </p>
          <div className="hero__actions">
            <a href="#start" className="btn btn-primary">
              Start writing — it's free
            </a>
            <a href="#how-it-works" className="btn btn-ghost">
              See how it works
            </a>
          </div>
        </div>

        <div className="hero__demo" aria-hidden="true">
          <div className="demo-card demo-card--raw">
            <span className="demo-card__label">Your notes</span>
            <p className="demo-card__text">
              red cotton kurta, size m, ₹599, soft fabric, good for summer
            </p>
          </div>

          <div className="demo-arrow">
            <svg viewBox="0 0 24 40" width="24" height="40">
              <path
                d="M12 0v34M3 27l9 9 9-9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="demo-card demo-card--polished">
            <span className="demo-card__label demo-card__label--accent">
              ProductScribe output
            </span>
            <h3 className="demo-card__title">Breezy Red Cotton Kurta</h3>
            <p className="demo-card__text">
              Stay cool through summer in this soft, breathable cotton kurta.
              A relaxed Medium fit and rich red tone make it easy to dress up
              or down — all for ₹599.
            </p>
            <span className="demo-card__tag">Tone: Friendly &amp; warm</span>
          </div>
        </div>
      </div>
    </section>
  );
}
