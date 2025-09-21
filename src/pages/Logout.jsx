import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  const nav = useNavigate();
  useEffect(() => { logout(); nav("/login", { replace: true }); }, []);
  return null;
}