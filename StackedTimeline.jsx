import { useState } from "react";
import { WINDOW_META } from "../../lib/oee.js";
import { num } from "../../lib/format.js";
import ProductionSignalTooltip from "./ProductionSignalTooltip.jsx";
import "./StackedTimeline.css";

/**
 * StackedTimeline (PRD Bab 8.1) — production timeline detail.
 * Each row is one hour; horizontal bands are colored by window classification.
 * Clicking a red band => downtime input; yellow/orange band => minor-stop input.
 * A classified band shows its reason label, and hovering any band shows the
 * dark "Production Signal" tooltip.
 *
 * @param {Array}    rows    from buildTimeline() (with any saved reasons applied)
 * @param {Function} onBand  (band, row) => void
 */
export default function StackedTimeline({ rows, onBand }) {
  const [hover, setHover] = useState(null); // { band, row, x, y }

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
              {row.bands.map((band) => {
                const meta = WINDOW_META[band.code];
                const clickable =
                  band.code === "D" || band.code === "SL" || band.code === "MS";
                return (
                  <button
                    key={band.id}
                    className={`stl__band ${band.reason ? "stl__band--classified" : ""}`}
                    style={{
                      flex: band.minutes,
                      background: meta.color,
                      cursor: clickable ? "pointer" : "default",
                    }}
                    onClick={clickable ? () => onBand?.(band, row) : undefined}
                    onMouseEnter={(e) =>
                      setHover({ band, row, x: e.clientX, y: e.clientY })
                    }
                    onMouseMove={(e) =>
                      setHover({ band, row, x: e.clientX, y: e.clientY })
                    }
                    onMouseLeave={() => setHover(null)}
                    onFocus={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      setHover({ band, row, x: r.left, y: r.bottom });
                    }}
                    onBlur={() => setHover(null)}
                    disabled={!clickable}
                    aria-label={
                      `${meta.label} ${band.minutes} minutes at ${row.hour}` +
                      (band.reason ? `, reason: ${band.reason}` : "") +
                      (clickable ? ", press to add reason" : "")
                    }
                  >
                    {band.reason &&
                      (band.minutes >= 4 ? (
                        <span className="stl__reason">{band.reason}</span>
                      ) : (
                        <span
                          className="stl__reason-dot"
                          aria-hidden
                          title={band.reason}
                        />
                      ))}
                  </button>
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

      {hover && (
        <ProductionSignalTooltip
          band={hover.band}
          row={hover.row}
          x={hover.x}
          y={hover.y}
        />
      )}
    </div>
  );
}
