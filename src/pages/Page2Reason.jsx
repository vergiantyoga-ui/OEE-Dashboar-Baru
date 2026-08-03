import { useMemo, useState } from "react";
import { Card } from "../components/ui";
import StackedTimeline from "../components/page2/StackedTimeline.jsx";
import EventOverview from "../components/page2/EventOverview.jsx";
import ClassifyModal from "../components/page2/ClassifyModal.jsx";
import {
  buildTimeline,
  DOWNTIME_EVENTS,
  DOWNTIME_CATEGORIES,
  REJECT_CATEGORIES,
} from "../data/mockData.js";
import "./Page2Reason.css";

const TIME_WINDOWS = [
  { id: 0, label: "07:00 – 15:00", start: 7 },
  { id: 1, label: "16:00 – 23:00", start: 16 },
  { id: 2, label: "00:00 – 06:00", start: 0 },
];

/**
 * Page 2 — Input Reason OEE (PRD Bab 8). Stacked-bar timeline + downtime
 * and reject overviews, all feeding the shared classify modal.
 */
export default function Page2Reason({ onToast }) {
  const [pageIdx, setPageIdx] = useState(0);
  const rows = useMemo(
    () => buildTimeline(TIME_WINDOWS[pageIdx].start, 8, 42 + pageIdx),
    [pageIdx]
  );

  const [downtimeEvents, setDowntimeEvents] = useState(DOWNTIME_EVENTS);
  const [rejectEvents, setRejectEvents] = useState([
    { id: "rj-1", range: "10:30 AM", quantity: 150, status: "uncommented" },
    { id: "rj-2", range: "09:12 AM", quantity: 75, status: "uncommented" },
    { id: "rj-3", range: "08:45 AM", quantity: 250, status: "uncommented" },
  ]);

  const [modal, setModal] = useState(null);

  function openDowntime(event) {
    setModal({
      kind: "downtime",
      categories: DOWNTIME_CATEGORIES,
      context: {
        range: event.range,
        durationMin: event.durationMin,
        machine: event.machine,
      },
      commit: () =>
        setDowntimeEvents((list) =>
          list.map((e) =>
            e.id === event.id
              ? { ...e, status: "planned", reason: "Breakdown / Classified" }
              : e
          )
        ),
    });
  }

  function openReject(event) {
    setModal({
      kind: "reject",
      categories: REJECT_CATEGORIES,
      context: { quantity: event.quantity, range: event.range },
      commit: () =>
        setRejectEvents((list) =>
          list.map((e) =>
            e.id === event.id
              ? { ...e, status: "planned", reason: "Process / Classified" }
              : e
          )
        ),
    });
  }

  function openFromBand(band, row) {
    const kind = band.code === "D" ? "downtime" : "minorstop";
    setModal({
      kind,
      categories: DOWNTIME_CATEGORIES,
      context: { range: `${row.hour}`, durationMin: band.minutes },
      commit: () => onToast?.("Reason saved to timeline segment"),
    });
  }

  return (
    <div className="page2">
      <Card
        title="Production Timeline Detail"
        action={
          <div className="page2__pager">
            <button
              className="page2__pager-btn"
              onClick={() => setPageIdx((i) => Math.max(0, i - 1))}
              disabled={pageIdx === 0}
              aria-label="Previous time window"
            >
              ‹
            </button>
            <span className="page2__pager-label">{TIME_WINDOWS[pageIdx].label}</span>
            <button
              className="page2__pager-btn"
              onClick={() =>
                setPageIdx((i) => Math.min(TIME_WINDOWS.length - 1, i + 1))
              }
              disabled={pageIdx === TIME_WINDOWS.length - 1}
              aria-label="Next time window"
            >
              ›
            </button>
          </div>
        }
      >
        <StackedTimeline rows={rows} onBand={openFromBand} />
        <p className="page2__hint">
          Tip: click a red (downtime) or yellow (speed / minor stop) segment to
          record a reason.
        </p>
      </Card>

      <div className="page2__grid">
        <EventOverview
          title="Downtime Overview"
          events={downtimeEvents}
          onClassify={openDowntime}
        />
        <EventOverview
          title="Reject / Scrap Overview"
          events={rejectEvents}
          onClassify={openReject}
          quantityKey
        />
      </div>

      {modal && (
        <ClassifyModal
          open={!!modal}
          kind={modal.kind}
          categories={modal.categories}
          context={modal.context}
          onClose={() => setModal(null)}
          onSave={() => {
            modal.commit?.();
            setModal(null);
            onToast?.("Classification saved");
          }}
        />
      )}
    </div>
  );
}
