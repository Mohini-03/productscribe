export default function Modal({ children }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.5)", padding: "20px" }}>
      {children}
    </div>
  );
}
