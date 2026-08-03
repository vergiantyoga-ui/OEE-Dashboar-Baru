import "./Badge.css";

/**
 * Badge — pill status indicator.
 * tone: neutral | success | danger | warning | info
 */
export default function Badge({ tone = "neutral", dot = false, children }) {
  return (
    <span className={`mes-badge mes-badge--${tone}`}>
      {dot && <span className="mes-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
