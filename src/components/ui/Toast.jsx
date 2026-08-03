import { useEffect } from "react";
import "./Toast.css";

/** Toast — transient confirmation message. */
export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onDismiss?.(), 2600);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;
  return (
    <div className="mes-toast" role="status" aria-live="polite">
      <span className="mes-toast__dot" aria-hidden />
      {message}
    </div>
  );
}
