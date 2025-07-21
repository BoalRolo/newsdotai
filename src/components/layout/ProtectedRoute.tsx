import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user, loading } = useAuth();

  if (loading) return null; // Optionally, render a loading spinner here

  return user ? children : <Navigate to="/" replace />;
}
