import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Loader } from "./ui/index.js";

export default function ProtectedRoute() {
  const { seller, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !seller) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [loading, seller, navigate, location]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader />
      </div>
    );
  }

  if (!seller) return null;

  return <Outlet />;
}