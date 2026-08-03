import { Modal, Button } from "../ui";
import { QA } from "../../data/mockData.js";
import { num } from "../../lib/format.js";
import "./QaAlert.css";

/**
 * QA Inspection alert (PRD A2.7). Non-blocking modal prompting the operator
 * to pull a sample and record release/reject.
 */
export default function QaAlert({ open, onClose, onSubmit }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="QA Inspection Required"
      subtitle={`Sample #${QA.currentSampleNo} · interval every ${num(QA.intervalPcs)} pcs`}
    >
      <div className="qa-alert">
        <p className="qa-alert__lead">
          Production output has reached the sampling interval. Pull a finished-goods
          sample, inspect quality, and record the result.
        </p>

        <div className="qa-alert__field">
          <label htmlFor="qa-sample">Current inspection sample</label>
          <input id="qa-sample" value={`#${QA.currentSampleNo}`} readOnly />
        </div>

        <div className="qa-alert__actions">
          <Button variant="success" block onClick={() => onSubmit?.("released")}>
            ✓ Released
          </Button>
          <Button variant="danger" block onClick={() => onSubmit?.("reject")}>
            ✕ Reject
          </Button>
        </div>
      </div>
    </Modal>
  );
}
