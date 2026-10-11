import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute: Disallows unauthenticated access.
 * If user is not logged in, immediately redirects to / (RoleGateway & Login).
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: "#475569",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3.5px solid #e2e8f0",
            borderTopColor: "#2563eb",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginBottom: "16px",
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: "14px", fontWeight: "600" }}>Verifying session...</div>
      </div>
    );
  }

  // Not logged in -> Redirect to /
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Role check if specific roles are required
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    if (user?.role === "client") {
      return <Navigate to="/client/dashboard" replace />;
    } else if (user?.role === "freelancer") {
      return <Navigate to="/freelancer/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
