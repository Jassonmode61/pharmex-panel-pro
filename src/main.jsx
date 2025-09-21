import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import App from "./App";              // mevcut ana uygulaman
import Login from "./pages/Login";
import Logout from "./pages/Logout";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* herkese açık: login */}
          <Route path="/login" element={<Login />} />
          {/* korumalı tüm rotalar */}
          <Route element={<ProtectedRoute />}>
            {/* mevcut tüm sayfaların '/*' altında App içinde olsun */}
            <Route path="/*" element={<App />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);