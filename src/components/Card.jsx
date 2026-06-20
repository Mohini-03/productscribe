import "./Card.css";

export default function Card({ number, title, description, accent = "sage" }) {
  return (
    <article className={`card card--${accent}`}>
      {number && <span className="card__number">{number}</span>}
      <h3 className="card__title">{title}</h3>
      <p className="card__description">{description}</p>
    </article>
  );
}
