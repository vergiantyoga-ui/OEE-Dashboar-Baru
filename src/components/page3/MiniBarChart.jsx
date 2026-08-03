/**
 * MiniBarChart — compact SVG bar chart for hourly reject trend.
 * @param {Array} data   [{ hour, value }]
 * @param {string} color
 */
export default function MiniBarChart({ data, color = "var(--c-red)", height = 64 }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = 100 / data.length;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Trend, peak ${max}`}
    >
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 16);
        const x = i * barW + barW * 0.18;
        const w = barW * 0.64;
        return (
          <g key={i}>
            <rect
              x={x}
              y={height - h - 12}
              width={w}
              height={Math.max(1, h)}
              rx="1.2"
              fill={color}
              opacity={d.value === 0 ? 0.18 : 0.9}
            />
            <text
              x={x + w / 2}
              y={height - 2}
              textAnchor="middle"
              fontSize="6"
              fill="var(--c-gray-soft)"
            >
              {d.hour}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
