import { useMemo, useState } from "react";
import ProcessOrderPerformance from "../components/page1/ProcessOrderPerformance.jsx";
import IdwProcessOrder from "../components/page1/IdwProcessOrder.jsx";
import ShiftPerformance from "../components/page1/ShiftPerformance.jsx";
import QaAlert from "../components/page1/QaAlert.jsx";
import { buildOeeSnapshot } from "../data/mockData.js";
import "./Page1Kpi.css";

/**
 * Page 1 — Dashboard KPI OEE (PRD Bab 7). Three-column layout:
 * Process Order Performance | IDW Process Order | Shift Performance.
 */
export default function Page1Kpi({ onToast }) {
  const snapshot = useMemo(() => buildOeeSnapshot(210), []);
  const [qaOpen, setQaOpen] = useState(false);

  return (
    <div className="page1">
      <div className="page1__grid">
        <ProcessOrderPerformance snapshot={snapshot} />
        <IdwProcessOrder
          onAction={(a) => onToast?.(`IDW action: ${a.replace("-", " ")}`)}
        />
        <ShiftPerformance snapshot={snapshot} />
      </div>

      <button className="page1__qa-trigger" onClick={() => setQaOpen(true)}>
        Simulate QA inspection alert
      </button>

      <QaAlert
        open={qaOpen}
        onClose={() => setQaOpen(false)}
        onSubmit={(result) => {
          setQaOpen(false);
          onToast?.(`QA sample ${result === "released" ? "released" : "rejected"}`);
        }}
      />
    </div>
  );
}
