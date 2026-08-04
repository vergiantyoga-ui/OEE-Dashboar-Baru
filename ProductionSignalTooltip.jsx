import { WINDOW_META } from "../../lib/oee.js";
import { num } from "../../lib/format.js";
import { PROCESS_ORDER, STD_RUN_RATE_DISPLAY } from "../../data/mockData.js";
import "./ProductionSignalTooltip.css";

/**
 * ProductionSignalTooltip (PRD Bab 8.1) — dark hover card that replaces the
 * native browser tooltip on timeline segments. Shows the production signal for
 * the hovered band; if the band has been classified, its reason is shown too.
 *
 * @param {object} band  the hovered band (with times, output, cumulative, reason)
 * @param {object} row   the hovered row
 * @param {number} x     viewport x (px)
 * @param {number} y     viewport y (px)
 */
export default function ProductionSignalTooltip({ band, row, x, y }) {
  if (!band) return null;

  const meta = WINDOW_META[band.code];
  const outputPerMin =
    band.minutes > 0 ? Math.round(band.output / band.minutes) : 0;

  // keep the card inside the viewport
  const CARD_W = 320;
  const left = Math.min(x + 16, window.innerWidth - CARD_W - 16);
  const top = Math.max(12, y + 16);

  return (
    <div
      className="pst"
      role="tooltip"
      style={{ left: Math.max(12, left), top }}
    >
      <div className="pst__head">
        <span className="pst__check" aria-hidden>
          ✓
        </span>
        <span className="pst__title">Production Signal</span>
        <span
          className="pst__state"
          style={{ background: meta.color }}
          title={meta.label}
        >
          {meta.label}
        </span>
      </div>

      <dl className="pst__rows">
        <Row label="Finished Goods">
          {PROCESS_ORDER.skuName}
          <span className="pst__mat"> ({PROCESS_ORDER.material})</span>
        </Row>
        <Row label="Batch">{PROCESS_ORDER.batch}</Row>
        <Row label="Time">
          {band.startTime} – {band.endTime}
        </Row>
        <Row label="Output (Run Rate)">
          {num(outputPerMin)} pcs{" "}
          <span className="pst__muted">({STD_RUN_RATE_DISPLAY} pcs)</span>
        </Row>
        <Row label="Total Output (Total Reject)">
          {num(band.cumOutput)} pcs{" "}
          <span className="pst__muted">({num(band.cumReject)} pcs)</span>
        </Row>
        {band.reason && (
          <Row label="Reason" accent>
            {band.reason}
          </Row>
        )}
      </dl>
    </div>
  );
}

function Row({ label, children, accent }) {
  return (
    <div className={`pst__row ${accent ? "pst__row--accent" : ""}`}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
