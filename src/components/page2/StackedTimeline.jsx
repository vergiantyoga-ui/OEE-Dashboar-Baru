import { WINDOW_META } from "../../lib/oee.js";
import { num } from "../../lib/format.js";
import "./StackedTimeline.css";

/**
 * StackedTimeline (PRD Bab 8.1) — production timeline detail.
 * Each row is one hour; horizontal bands are colored by window classification.
 * Clicking a red band => downtime input; yellow band => minor-stop input.
 *
 * @param {Array}  rows      from buildTimeline()
 * @param {Function} onBand  (band, row) => void
 */
export default function StackedTimeline({ rows, onBand }) {
  const legend = [
    ["EF", "Effective"],
    ["SL", "Speed Loss"],
    ["MS", "Minor Stop"],
    ["D", "Downtime"],
    ["PD", "Planned"],
  ];

  return (
    <div className="stl">
      <div className="stl__legend">
        {legend.map(([code, label]) => (
          <span className="stl__legend-item" key={code}>
            <span
              className="stl__swatch"
              style={{ background: WINDOW_META[code].color }}
            />
            {label}
          </span>
        ))}
      </div>

      <div className="stl__chart" role="table" aria-label="Production timeline by hour">
        {rows.map((row) => (
          <div className="stl__row" role="row" key={row.hour}>
            <div className="stl__hour" role="rowheader">
              {row.hour}
            </div>
            <div className="stl__bands" role="cell">
              {row.poStart && (
                <span className="stl__marker stl__marker--start" title="Process order start">
                  ▶
                </span>
              )}
              {row.hasReject && (
                <span className="stl__marker stl__marker--reject" title="Reject in this hour">
                  ▲
                </span>
              )}
              {row.bands.map((band, i) => {
                const meta = WINDOW_META[band.code];
                const clickable = band.code === "D" || band.code === "SL" || band.code === "MS";
                return (
                  <button
                    key={i}
                    className="stl__band"
                    style={{
                      flex: band.minutes,
                      background: meta.color,
                      cursor: clickable ? "pointer" : "default",
                    }}
                    title={`${meta.label} · ${band.minutes} min`}
                    onClick={clickable ? () => onBand?.(band, row) : undefined}
                    disabled={!clickable}
                    aria-label={`${meta.label} ${band.minutes} minutes at ${row.hour}${
                      clickable ? ", click to add reason" : ""
                    }`}
                  />
                );
              })}
            </div>
            <div className="stl__meta" role="cell">
              <span className="stl__out">{num(row.output)} pcs</span>
              <span className="stl__sched">{row.scheduledMin} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
