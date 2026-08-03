import "./RunRateBar.css";

/**
 * RunRateBar — the signature OEE run-rate gauge.
 * A three-band track (red / green / yellow) with a triangular marker for the
 * target and the actual/standard readout on the right (PRD A3.1.3).
 *
 * Visual cue rule (PRD): the marker color reflects actual vs standard.
 *   actual == standard -> green, actual > standard -> yellow, actual < -> red
 *
 * @param {string} title
 * @param {number} target    target catch-up run rate (shown top-left)
 * @param {number} actual    current actual run rate
 * @param {number} standard  standard run rate
 */
export default function RunRateBar({ title, target, actual, standard }) {
  // Position the marker along the track relative to a sensible max.
  const scaleMax = Math.max(standard, actual, target) * 1.4 || 1;
  const markerPct = clampPct((actual / scaleMax) * 100);
  const stdPct = clampPct((standard / scaleMax) * 100);

  let markerTone = "green";
  if (actual > standard) markerTone = "yellow";
  else if (actual < standard) markerTone = "red";

  return (
    <div className="mes-rr">
      <div className="mes-rr__top">
        <span className="mes-rr__title">{title}</span>
      </div>
      <div className="mes-rr__row">
        <div className="mes-rr__target">
          <span className="mes-rr__k">Target</span>
          <strong>{target}</strong>
        </div>
        <div className="mes-rr__actual">
          <span className="mes-rr__k">Actual / Standard</span>
          <span>
            <strong>{actual}</strong>
            <span className="mes-rr__std"> / {standard}</span>
          </span>
        </div>
      </div>

      <div
        className="mes-rr__track"
        role="img"
        aria-label={`${title}: actual ${actual}, standard ${standard}, target ${target} pcs per minute`}
      >
        {/* three bands: red up to std, green at std, yellow above */}
        <div className="mes-rr__band mes-rr__band--red" style={{ width: `${stdPct}%` }} />
        <div className="mes-rr__band mes-rr__band--green" style={{ width: `6%` }} />
        <div className="mes-rr__band mes-rr__band--yellow" style={{ flex: 1 }} />

        {/* marker for actual */}
        <span
          className={`mes-rr__marker mes-rr__marker--${markerTone}`}
          style={{ left: `${markerPct}%` }}
        />
      </div>
    </div>
  );
}

function clampPct(v) {
  return Math.min(98, Math.max(2, v));
}
