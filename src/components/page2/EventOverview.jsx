import { useState } from "react";
import { Card, Badge, Button } from "../ui";
import "./EventOverview.css";

/**
 * EventOverview (PRD Bab 8.2 / 8.3) — lists events needing classification,
 * split into Uncommented (action required) and Committed/Planned tabs.
 *
 * @param {string} title
 * @param {Array}  events   [{ id, range, durationMin, status, machine, reason }]
 * @param {Function} onClassify
 */
export default function EventOverview({ title, events, onClassify, quantityKey = false }) {
  const [tab, setTab] = useState("uncommented");

  const uncommented = events.filter((e) => e.status === "uncommented");
  const planned = events.filter((e) => e.status !== "uncommented");
  const rows = tab === "uncommented" ? uncommented : planned;

  return (
    <Card
      title={title}
      action={
        uncommented.length > 0 && (
          <Badge tone="warning">{uncommented.length} action required</Badge>
        )
      }
    >
      <div className="evo">
        <div className="evo__tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "uncommented"}
            className={`evo__tab ${tab === "uncommented" ? "is-active" : ""}`}
            onClick={() => setTab("uncommented")}
          >
            Uncommented ({uncommented.length})
          </button>
          <button
            role="tab"
            aria-selected={tab === "planned"}
            className={`evo__tab ${tab === "planned" ? "is-active" : ""}`}
            onClick={() => setTab("planned")}
          >
            Committed ({planned.length})
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="evo__empty">
            {tab === "uncommented"
              ? "Nothing to classify. All events are committed."
              : "No committed events yet."}
          </p>
        ) : (
          <ul className="evo__list">
            {rows.map((e) => (
              <li className="evo__row" key={e.id}>
                <div className="evo__cell">
                  <span className="evo__k">
                    {quantityKey ? "Time" : "Time Range"}
                  </span>
                  <strong>{e.range}</strong>
                </div>
                <div className="evo__cell">
                  <span className="evo__k">
                    {quantityKey ? "Quantity" : "Duration"}
                  </span>
                  <strong>
                    {quantityKey ? `${e.quantity} pcs` : `${e.durationMin} min`}
                  </strong>
                </div>
                <div className="evo__cell">
                  <span className="evo__k">Status</span>
                  {e.status === "uncommented" ? (
                    <Badge tone="danger">Action Required</Badge>
                  ) : (
                    <Badge tone="success">Committed</Badge>
                  )}
                </div>
                <div className="evo__cell evo__cell--action">
                  {e.status === "uncommented" ? (
                    <Button variant="primary" size="sm" onClick={() => onClassify?.(e)}>
                      Classify
                    </Button>
                  ) : (
                    <span className="evo__reason">{e.reason}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
