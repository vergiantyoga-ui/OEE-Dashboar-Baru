import { Card, ProgressBar, Button } from "../ui";
import { num } from "../../lib/format.js";
import { IDW } from "../../data/mockData.js";
import "./IdwProcessOrder.css";

/**
 * IDW Process Order (PRD A3.2) — middle column of Page 1.
 * Packaging KPIs, functional buttons, and IDW/OEE output comparison.
 */
export default function IdwProcessOrder({ onAction }) {
  const gap = IDW.outputOee > 0 ? (IDW.outputOee - IDW.outputIdw) / IDW.outputOee : 0;

  return (
    <Card title="IDW Process Order" icon={<span aria-hidden>▦</span>}>
      <div className="idw">
        <PackRow label="Inner Box" {...IDW.innerBox} />
        <PackRow label="Karton Box" {...IDW.kartonBox} />
        <PackRow label="Pallet" {...IDW.pallet} />

        <div className="idw__buttons">
          <Button variant="info" block onClick={() => onAction?.("print-label")}>
            Print Contoh Label
          </Button>
          <Button variant="warning" block onClick={() => onAction?.("test-print")}>
            Test Printing
          </Button>
          <Button variant="danger" block onClick={() => onAction?.("label-rusak")}>
            Label Rusak
          </Button>
          <Button variant="danger" block onClick={() => onAction?.("delete-count")}>
            Delete Count
          </Button>
        </div>

        <dl className="idw__kpis">
          <KpiRow label="Output IDW" value={num(IDW.outputIdw)} />
          <KpiRow label="Output OEE" value={num(IDW.outputOee)} accent />
          <KpiRow
            label="Gap"
            value={`${(gap * 100).toFixed(2)}%`}
            tone="danger"
          />
          <KpiRow label="Total MPQ" value={`${num(IDW.totalMpq)} pcs`} muted />
        </dl>
      </div>
    </Card>
  );
}

function PackRow({ label, actual, target }) {
  return (
    <div className="idw__pack">
      <div className="idw__pack-head">
        <span>{label}</span>
        <strong>
          {num(actual)} <span>/ {num(target)}</span>
        </strong>
      </div>
      <ProgressBar value={actual} max={target || 1} label={`${label} progress`} />
    </div>
  );
}

function KpiRow({ label, value, accent, tone, muted }) {
  return (
    <div className={`idw__kpi ${muted ? "idw__kpi--muted" : ""} ${tone ? `idw__kpi--${tone}` : ""}`}>
      <dt>{label}</dt>
      <dd className={accent ? "idw__kpi-accent" : ""}>{value}</dd>
    </div>
  );
}
