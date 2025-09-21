// src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Sayfalar (lazy)
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

// Auth sayfaları
const Login         = lazy(() => import("./pages/Login.jsx"));
const Logout        = lazy(() => import("./pages/Logout.jsx"));
// İstersen ekleyebilirsin (zorunlu değil):
const NotFound      = lazy(() => import("./pages/NotFound.jsx"));

import { getSession, hasRole } from "./utils/auth.js";

function ProtectedRoute({ roles = [], children }) {
  const sess = getSession();
  if (!sess) return <Navigate to="/login" replace />;
  if (roles.length && !hasRole(sess, roles)) return <Navigate to="/" replace />;
  return children;
}

// Giriş yapmış kullanıcı login ekranına gelirse dashboard'a yönlendir
function PublicRoute({ children }) {
  const sess = getSession();
  if (sess) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/logout");

  // Auth rotaları: chrome (Sidebar/Topbar) olmadan basit görünüm
  if (isAuthPage) {
    return (
      <div className="auth-shell">
        <ErrorBoundary>
          <Suspense fallback={<div className="card">Yükleniyor…</div>}>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              {/* Logout sayfası session'ı temizleyip /login'e döndürüyor */}
              <Route path="/logout" element={<Logout />} />
              {/* yanlış URL gelirse login'e at */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  // Uygulama shell'i (admin)
  return (
    <div className="admin-shell">
      <aside className="admin-aside">
        <div className="brand">
          <span className="pill">💊</span>
          <div>
            <div className="brand-title">Pharmex</div>
            <div className="brand-sub">Admin</div>
          </div>
        </div>
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>
      </aside>

      <main className="admin-main">
        <Topbar />
        <div className="page">
          <ErrorBoundary>
            <Suspense fallback={<div className="card">Yükleniyor…</div>}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute roles={["Admin", "Destek"]}>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/reports" element={<Reports />} />
                <Route
                  path="/audit"
                  element={
                    <ProtectedRoute roles={["Admin"]}>
                      <Audit />
                    </ProtectedRoute>
                  }
                />
                <Route path="/security" element={<Security />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />

                {/* yakalanmayan rotalar */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}