import "./ProgressBar.css";

/**
 * ProgressBar — filled/remaining bar (MES pattern).
 * @param {number} value  current
 * @param {number} max    total
 * @param {string} color  CSS color for the fill
 */
export default function ProgressBar({
  value,
  max,
  color = "var(--c-blue-dark)",
  height = 10,
  label,
}) {
  const pctRaw = max > 0 ? (value / max) * 100 : 0;
  const pct = Math.min(100, Math.max(0, pctRaw));
  return (
    <div
      className="mes-progress"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="mes-progress__track" style={{ height }}>
        <div
          className="mes-progress__fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
