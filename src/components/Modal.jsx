// src/components/Modal.jsx
import React, { useEffect } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 720, // px
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ width: "min(92vw, " + width + "px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <div className="modal-head">{title}</div>}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}