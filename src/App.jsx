import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import { getSession, hasRole, clearSession } from "./utils/auth.js";

// Lazy sayfalar
const Login         = lazy(() => import("./pages/Login.jsx"));
const Dashboard     = lazy(() => import("./pages/Dashboard.jsx"));
const Users         = lazy(() => import("./pages/Users.jsx"));
const Catalog       = lazy(() => import("./pages/Catalog.jsx"));
const Orders        = lazy(() => import("./pages/Orders.jsx"));
const Reports       = lazy(() => import("./pages/Reports.jsx"));
const Settings      = lazy(() => import("./pages/Settings.jsx"));
const Returns       = lazy(() => import("./pages/Returns.jsx"));
const Audit         = lazy(() => import("./pages/Audit.jsx"));
const Notifications = lazy(() => import("./pages/Notifications.jsx"));
const Profile       = lazy(() => import("./pages/Profile.jsx"));
const Security      = lazy(() => import("./pages/Security.jsx"));

// Korumalı rota
function ProtectedRoute({ roles = [], children }) {
  const sess = getSession();
  if (!sess) return <Navigate to="/login" replace />;
  if (roles.length && !hasRole(sess, roles)) return <Navigate to="/dashboard" replace />;
  return children;
}

// Admin shell (sidebar + topbar + içerik)
function AdminShell({ children }) {
  return (
    <div
      className="admin-shell"
      style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" }}
    >
      <aside className="admin-aside" style={{ background: "#0b1330", color: "#dfe7ff" }}>
        <div className="brand" style={{ padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="pill" style={{ fontSize: 22 }}>💊</span>
          <div>
            <div className="brand-title" style={{ fontWeight: 700 }}>Pharmex</div>
            <div className="brand-sub" style={{ opacity: .7 }}>Admin</div>
          </div>
        </div>
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>
      </aside>

      <main className="admin-main" style={{ background: "#0f1b3f" }}>
        <Topbar onLogout={() => { clearSession(); window.location.href = "/login"; }} />
        <div className="page" style={{ padding: 20 }}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  // Shell ile sarmalayıcı yardımcıları
  const wrap = (node) => (
    <ProtectedRoute>
      <AdminShell>{node}</AdminShell>
    </ProtectedRoute>
  );

  const wrapWithRoles = (roles, node) => (
    <ProtectedRoute roles={roles}>
      <AdminShell>{node}</AdminShell>
    </ProtectedRoute>
  );

  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Yükleniyor…</div>}>
      <Routes>
        {/* root -> login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* login herkese açık */}
        <Route path="/login" element={<Login />} />

        {/* korumalı sayfalar */}
        <Route path="/dashboard"     element={wrap(<Dashboard />)} />
        <Route path="/users"         element={wrapWithRoles(["Admin","Destek"], <Users />)} />
        <Route path="/catalog"       element={wrap(<Catalog />)} />
        <Route path="/orders"        element={wrap(<Orders />)} />
        <Route path="/returns"       element={wrap(<Returns />)} />
        <Route path="/reports"       element={wrap(<Reports />)} />
        <Route path="/audit"         element={wrapWithRoles(["Admin"], <Audit />)} />
        <Route path="/security"      element={wrap(<Security />)} />
        <Route path="/settings"      element={wrap(<Settings />)} />
        <Route path="/notifications" element={wrap(<Notifications />)} />
        <Route path="/profile"       element={wrap(<Profile />)} />

        {/* 404: oturum varsa dashboard'a, yoksa login'e */}
        <Route
          path="*"
          element={getSession() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Suspense>
  );
}