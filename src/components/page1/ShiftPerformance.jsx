import { useState } from "react";
import { Card, RunRateBar, ProgressBar, DonutChart, Modal, Badge } from "../ui";
import { num } from "../../lib/format.js";
import { pct } from "../../lib/oee.js";
import { SHIFT } from "../../data/mockData.js";
import "./ShiftPerformance.css";

/**
 * Shift Performance (PRD A3.3) — right column of Page 1.
 * Output/reject progress, shift run-rate gauges, and the OEE donut with a
 * SKU-ON/OFF toggle and an expand → Production Line OEE Detail modal.
 */
export default function ShiftPerformance({ snapshot }) {
  const [skuOn, setSkuOn] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);

  const line = snapshot.line;
  const actualOutput = snapshot.totalOutput;
  const progress = actualOutput / SHIFT.targetOutput;

  return (
    <div className="sp">
      <Card title="Shift Performance">
        <div className="sp__output">
          <span className="sp__k">Actual Output</span>
          <div className="sp__output-value">
            {num(actualOutput)} <span>({num(snapshot.totalReject)})</span>
          </div>
          <div className="sp__output-meta">
            <span>
              {num(actualOutput)} / {num(SHIFT.targetOutput)}
            </span>
            <span className="sp__output-pct">{pct(progress)}</span>
          </div>
          <ProgressBar
            value={actualOutput}
            max={SHIFT.targetOutput}
            label="Shift output progress"
          />
        </div>
      </Card>

      <Card title="Shift Run Rate">
        <div className="sp__gauges">
          <RunRateBar title="Shift Run Rate SKU" target={114} actual={102} standard={110} />
          <RunRateBar title="Shift Run Rate Line" target={80} actual={102} standard={60} />
        </div>
      </Card>

      <Card
        title="Production Line OEE"
        muted
        action={
          <div className="sp__oee-actions">
            <button
              className={`sp__toggle ${skuOn ? "sp__toggle--on" : "sp__toggle--off"}`}
              onClick={() => setSkuOn((v) => !v)}
              aria-pressed={skuOn}
              aria-label={`SKU mode ${skuOn ? "on" : "off"}`}
            >
              <span className="sp__toggle-knob" />
              {skuOn ? "SKU-ON" : "SKU-OFF"}
            </button>
            <button
              className="sp__expand"
              onClick={() => setDetailOpen(true)}
              aria-label="Expand OEE detail"
            >
              ⤢
            </button>
          </div>
        }
      >
        <div className="sp__oee">
          <DonutChart value={line.oee} label={`Line OEE ${pct(line.oee)}`} />
          <div className="sp__oee-components">
            <Comp label="AVA" value={line.availability} />
            <Comp label="PER" value={line.performance} />
            <Comp label="QUA" value={line.quality} />
          </div>
        </div>
      </Card>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Production Line OEE Detail"
        subtitle={snapshot.perMachine.length + " machines · TUP01"}
        wide
        headerRight={<Badge tone="info">SKU {skuOn ? "ON" : "OFF"}</Badge>}
      >
        <div className="sp__detail">
          <div className="sp__detail-line">
            <DonutChart value={line.oee} size={140} />
            <div className="sp__detail-comps">
              <Comp label="AVA" value={line.availability} wide />
              <Comp label="PER" value={line.performance} wide />
              <Comp label="QUA" value={line.quality} wide />
            </div>
          </div>

          <h4 className="sp__detail-title">Machine OEE Detail</h4>
          <div className="sp__machines">
            {snapshot.perMachine.map((pm) => (
              <div className="sp__machine" key={pm.machine.id}>
                <div className="sp__machine-head">
                  <DonutChart value={pm.oee} size={72} stroke={9} />
                  <div>
                    <strong>{pm.machine.id}</strong>
                    <span>{pm.machine.name}</span>
                  </div>
                </div>
                <div className="sp__machine-comps">
                  <Comp label="AVA" value={pm.availability} small />
                  <Comp label="PER" value={pm.performance} small />
                  <Comp label="QUA" value={pm.quality} small />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Comp({ label, value, wide, small }) {
  return (
    <div className={`sp__comp ${wide ? "sp__comp--wide" : ""} ${small ? "sp__comp--small" : ""}`}>
      <span className="sp__comp-label">{label}</span>
      <strong className="sp__comp-value">{pct(value)}</strong>
      <ProgressBar value={value * 100} max={100} height={5} label={`${label} ${pct(value)}`} />
    </div>
  );
}
