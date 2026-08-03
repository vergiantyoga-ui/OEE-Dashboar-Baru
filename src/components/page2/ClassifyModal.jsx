import { useState, useEffect } from "react";
import { Modal, Button, Badge } from "../ui";
import { MACHINES } from "../../data/mockData.js";
import "./ClassifyModal.css";

/**
 * ClassifyModal (PRD Bab 8.2 / 8.3) — category → reason → machine → time → notes.
 * Reused for downtime, minor stop, and reject classification.
 *
 * @param {string} kind         "downtime" | "minorstop" | "reject"
 * @param {Array}  categories   [{ id, label, reasons: [] }]
 * @param {object} context      { range, durationMin, machine, quantity }
 */
export default function ClassifyModal({
  open,
  onClose,
  onSave,
  kind = "downtime",
  categories = [],
  context = {},
}) {
  const isReject = kind === "reject";
  const title =
    kind === "downtime"
      ? "Edit Downtime"
      : kind === "minorstop"
      ? "Edit Minor Stop"
      : "Edit Reject";

  const [catId, setCatId] = useState(categories[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [machine, setMachine] = useState(context.machine ?? MACHINES[0].id);
  const [endTime, setEndTime] = useState(context.endTime ?? "");
  const [quantity, setQuantity] = useState(context.quantity ?? 0);
  const [notes, setNotes] = useState("");
  const [causes, setCauses] = useState([]);

  // reset when opened with a new context
  useEffect(() => {
    if (open) {
      setCatId(categories[0]?.id ?? "");
      setReason("");
      setMachine(context.machine ?? MACHINES[0].id);
      setEndTime(context.endTime ?? "");
      setQuantity(context.quantity ?? 0);
      setNotes("");
      setCauses([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const activeCat = categories.find((c) => c.id === catId) ?? categories[0];
  const classified = causes.length > 0;

  function addCause() {
    if (!reason) return;
    setCauses((cs) => [...cs, { reason, machine, category: activeCat?.label }]);
    setReason("");
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={
        isReject
          ? `${context.quantity ?? 0} pcs to classify`
          : `${context.range ?? ""} · ${context.durationMin ?? 0} mins duration`
      }
      wide
      headerRight={
        <Badge tone={kind === "reject" ? "danger" : kind === "minorstop" ? "warning" : "danger"}>
          {kind === "minorstop" ? "MINOR STOP" : kind === "reject" ? "REJECT" : "DOWNTIME"}
        </Badge>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => onSave?.({ causes, notes })}
            disabled={!classified}
          >
            Save Classification
          </Button>
        </>
      }
    >
      <div className="cls">
        <input
          className="cls__search"
          placeholder={`Search ${isReject ? "reject" : "downtime"} reason…`}
          aria-label="Search reason"
        />

        <div className="cls__cols">
          {/* Categories */}
          <div className="cls__col">
            <h4 className="cls__col-title">Categories</h4>
            <ul className="cls__list">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    className={`cls__cat ${catId === c.id ? "is-active" : ""}`}
                    onClick={() => {
                      setCatId(c.id);
                      setReason("");
                    }}
                  >
                    {c.label}
                    <span aria-hidden>›</span>
                  </button>
                </li>
              ))}
            </ul>

            <h4 className="cls__col-title cls__col-title--gap">Machine</h4>
            <div className="cls__machines">
              {MACHINES.map((m) => (
                <button
                  key={m.id}
                  className={`cls__machine ${machine === m.id ? "is-active" : ""}`}
                  onClick={() => setMachine(m.id)}
                >
                  {m.id}
                </button>
              ))}
            </div>
          </div>

          {/* Reasons */}
          <div className="cls__col">
            <h4 className="cls__col-title">
              Reasons: {activeCat?.label ?? ""}
            </h4>
            <ul className="cls__list">
              {(activeCat?.reasons ?? []).map((r) => (
                <li key={r}>
                  <button
                    className={`cls__reason ${reason === r ? "is-active" : ""}`}
                    onClick={() => setReason(r)}
                  >
                    {reason === r && <span className="cls__check" aria-hidden>✓</span>}
                    {r}
                  </button>
                </li>
              ))}
            </ul>

            {isReject ? (
              <div className="cls__field">
                <label htmlFor="cls-qty">Quantity (pcs)</label>
                <input
                  id="cls-qty"
                  type="number"
                  value={quantity}
                  min={0}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
            ) : (
              <div className="cls__times">
                <div className="cls__field">
                  <label htmlFor="cls-start">Start Time</label>
                  <input
                    id="cls-start"
                    value={context.startTime ?? (context.range?.split(" - ")[0] ?? "")}
                    readOnly
                  />
                </div>
                <div className="cls__field">
                  <label htmlFor="cls-end">End Time</label>
                  <input
                    id="cls-end"
                    value={endTime || (context.range?.split(" - ")[1] ?? "")}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button variant="secondary" size="sm" onClick={addCause} disabled={!reason}>
              + Add cause
            </Button>
          </div>

          {/* Cause list */}
          <div className="cls__col">
            <h4 className="cls__col-title">Cause List</h4>
            {causes.length === 0 ? (
              <p className="cls__empty">
                No causes yet. Pick a reason and add it to classify this event.
              </p>
            ) : (
              <ul className="cls__causes">
                {causes.map((c, i) => (
                  <li key={i} className="cls__cause">
                    <div>
                      <strong>{c.reason}</strong>
                      <span>Machine: {c.machine}</span>
                    </div>
                    <button
                      className="cls__cause-remove"
                      onClick={() => setCauses((cs) => cs.filter((_, j) => j !== i))}
                      aria-label={`Remove ${c.reason}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="cls__status">
              <span className="cls__status-label">Classification Status</span>
              <Badge tone={classified ? "success" : "warning"}>
                {classified ? "✓ Fully Classified" : "Action Required"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="cls__field">
          <label htmlFor="cls-notes">Notes</label>
          <textarea
            id="cls-notes"
            rows={2}
            placeholder="Add investigation notes, root cause analysis, corrective actions, or operator comments…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
