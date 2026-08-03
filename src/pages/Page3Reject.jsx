import { useMemo, useState } from "react";
import { Card, Badge } from "../components/ui";
import MiniBarChart from "../components/page3/MiniBarChart.jsx";
import { REJECT_KPI, buildRejectTrend } from "../data/mockData.js";
import { num } from "../lib/format.js";
import "./Page3Reject.css";

/**
 * Page 3 — Dashboard Reject 7-Segments (PRD Bab 9).
 * Reject KPI per category + hourly trend, with a category filter.
 */
export default function Page3Reject() {
  const trend = useMemo(() => buildRejectTrend(7), []);
  const [active, setActive] = useState("all");

  const totalReject = REJECT_KPI.segments.reduce((a, s) => a + s.value, 0);
  const shown =
    active === "all" ? trend : trend.filter((s) => s.key === active);

  return (
    <div className="page3">
      <div className="page3__top">
        <Card title="Production Reject KPI" className="page3__kpi">
          <div className="page3__output">
            <span className="page3__k">Output</span>
            <strong>{num(REJECT_KPI.output)}</strong>
          </div>
          <div className="page3__segments">
            {REJECT_KPI.segments.map((s) => (
              <button
                key={s.key}
                className={`page3__seg ${active === s.key ? "is-active" : ""}`}
                onClick={() => setActive(active === s.key ? "all" : s.key)}
                aria-pressed={active === s.key}
              >
                <span className="page3__seg-label">{s.label}</span>
                <span className="page3__seg-value">{s.value}</span>
              </button>
            ))}
          </div>
          <div className="page3__total">
            <span>Total Reject</span>
            <Badge tone="danger">{totalReject} pcs</Badge>
          </div>
        </Card>

        <Card
          title="Reject Trend"
          className="page3__trend"
          action={
            <div className="page3__filter">
              <label htmlFor="reject-filter" className="sr-only">
                Filter reject category
              </label>
              <select
                id="reject-filter"
                value={active}
                onChange={(e) => setActive(e.target.value)}
              >
                <option value="all">All categories</option>
                {REJECT_KPI.segments.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          }
        >
          <div className="page3__charts">
            {shown.map((s) => (
              <div className="page3__chart" key={s.key}>
                <div className="page3__chart-head">
                  <span>{s.label}</span>
                  <strong>{s.value}</strong>
                </div>
                <MiniBarChart data={s.trend} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
