import { useEffect, useRef } from "react";
import "./Modal.css";

/**
 * Modal — accessible dialog. Traps focus lightly, closes on Esc / backdrop.
 * Uses in-flow overlay (no position:fixed dependency issues here since we
 * render at app root).
 */
export default function Modal({ open, onClose, title, subtitle, headerRight, children, footer, wide = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    // move focus into dialog
    ref.current?.focus();
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="mes-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={`mes-modal ${wide ? "mes-modal--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
      >
        <header className="mes-modal__head">
          <div>
            {title && <h2 className="mes-modal__title">{title}</h2>}
            {subtitle && <p className="mes-modal__sub">{subtitle}</p>}
          </div>
          <div className="mes-modal__head-right">
            {headerRight}
            <button
              className="mes-modal__close"
              onClick={onClose}
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>
        </header>
        <div className="mes-modal__body">{children}</div>
        {footer && <footer className="mes-modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}
