// src/components/Guard.jsx
export default function Guard({ role, user, children, fallback=null }){
  if (!role) return children;
  return user?.role===role ? children : fallback;
}