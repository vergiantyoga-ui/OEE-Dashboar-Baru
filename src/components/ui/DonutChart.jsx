/**
 * DonutChart — SVG ring for a single percentage (OEE).
 * Color follows status: >= target green, else red (PRD Bab 14.3 note).
 *
 * @param {number} value    0..1
 * @param {number} target   0..1 threshold for "good"
 * @param {number} size     px
 */
export default function DonutChart({
  value,
  target = 0.85,
  size = 150,
  stroke = 14,
  label,
}) {
  const pct = Math.min(1, Math.max(0, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const good = value >= target;
  const color = good ? "var(--c-green)" : "var(--c-red)";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label || `OEE ${(value * 100).toFixed(1)} percent`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e6e9f0"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeDashoffset={c * 0.25}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.2}
        fontWeight="700"
        fill="var(--c-navy)"
      >
        {(value * 100).toFixed(1)}%
      </text>
    </svg>
  );
}
