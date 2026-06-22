export default function Toast({ message }) {
  return (
    <div style={{ background: "#333", color: "#fff", padding: "10px", marginTop: "10px" }}>
      {message}
    </div>
  );
}
