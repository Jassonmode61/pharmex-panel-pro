// src/components/RequireRole.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { hasAnyRole } from "../utils/auth";

export default function RequireRole({ roles, children }) {
  // Rollerden biri varsa çocukları göster, yoksa dashboard'a at
  return hasAnyRole(roles) ? children : <Navigate to="/" replace />;
}