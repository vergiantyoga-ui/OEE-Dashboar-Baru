import { useState } from "react";
import { Card, RunRateBar, ProgressBar } from "../ui";
import { num } from "../../lib/format.js";
import { PROCESS_ORDER, OPERATORS, QA } from "../../data/mockData.js";
import "./ProcessOrderPerformance.css";

/**
 * Process Order Performance (PRD A3.1) — left column of Page 1.
 * Header + operator dropdown + run-rate gauges + total output + QA + timers.
 */
export default function ProcessOrderPerformance({ snapshot }) {
  const [operator, setOperator] = useState(OPERATORS[0]);
  const po = PROCESS_ORDER;

  const totalOutput = snapshot.totalOutput;
  const actualRrSku = 100; // mock actual readouts (would derive from sensor)
  const actualRrLine = 100;

  return (
    <Card className="pop">
      <div className="pop__head">
        <div>
          <span className="pop__eyebrow">Process Order Performance</span>
          <h2 className="pop__po">#{po.code}</h2>
        </div>
        <div className="pop__batch">
          <span>Batch</span>
          <strong>{po.batch}</strong>
        </div>
      </div>

      <div className="pop__sku">
        <div className="pop__sku-name">SKU: {po.skuName}</div>
        <div className="pop__sku-mat">Material #{po.material}</div>
      </div>

      <label className="pop__operators">
        <span className="pop__label">Operators</span>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          aria-label="Select operator on duty"
        >
          {OPERATORS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <div className="pop__operator-chips" aria-hidden="true">
          {OPERATORS.slice(0, 8).join(" · ")}
        </div>
      </label>

      <div className="pop__gauges">
        <RunRateBar
          title="Run Rate SKU"
          target={120}
          actual={actualRrSku}
          standard={po.standardRunRateSku}
        />
        <RunRateBar
          title="Run Rate Line"
          target={80}
          actual={actualRrLine}
          standard={po.standardRunRateLine}
        />
      </div>

      <div className="pop__output">
        <span className="pop__label">Total Output</span>
        <div className="pop__output-value">
          {num(totalOutput)}{" "}
          <span className="pop__output-reject">({num(snapshot.totalReject)})</span>
          <span className="pop__output-mpq">/ {num(po.mpq)} Total MPQ</span>
        </div>
        <ProgressBar
          value={totalOutput}
          max={po.mpq}
          label="Total output vs MPQ"
        />
      </div>

      <div className="pop__qa">
        <span className="pop__label">QA Inspection</span>
        <div className="pop__qa-grid">
          <QaStat label="Sample" value={QA.sample} tone="navy" />
          <QaStat label="Released" value={QA.released} tone="green" />
          <QaStat label="Reject" value={QA.reject} tone="red" />
        </div>
      </div>

      <div className="pop__timers">
        <Timer label="Start" value={po.startTime} tone="muted" />
        <Timer label="Remaining" value={po.remaining} tone="info" />
        <Timer label="Est. Finished" value={po.estFinish} tone="muted" />
      </div>
    </Card>
  );
}

function QaStat({ label, value, tone }) {
  return (
    <div className="pop__qa-stat">
      <span className="pop__qa-label">{label}</span>
      <strong className={`pop__qa-value pop__qa-value--${tone}`}>{value}</strong>
    </div>
  );
}

function Timer({ label, value, tone }) {
  return (
    <div className={`pop__timer pop__timer--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
