import { useEffect, useState } from "react";
import { Badge, Button } from "../ui";
import { timeHMS, dateLong } from "../../lib/format.js";
import { LINE, SHIFT } from "../../data/mockData.js";
import "./DashboardHeader.css";

/**
 * DashboardHeader (PRD Bab 6 / A5) — global, sticky across all pages.
 * Shows line/plant/zone, live clock+date, shift, running/split status,
 * and the AMR + Finish Work Order actions.
 */
export default function DashboardHeader() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const running = LINE.status === "running";

  return (
    <header className="mes-header">
      <div className="mes-header__left">
        <span className="mes-header__brand">FRO</span>
        <div className="mes-header__line">
          <div className="mes-header__line-main">
            {LINE.id} <span className="mes-header__sep">|</span> {LINE.plant}{" "}
            <span className="mes-header__sep">|</span> {LINE.zone}
          </div>
          <div className="mes-header__line-sub">
            Shift {SHIFT.no} • {dateLong(now)}
          </div>
        </div>

        <div className="mes-header__clock" aria-label="Current time">
          {timeHMS(now)}
        </div>

        <div className="mes-header__status">
          <Badge tone={running ? "success" : "danger"} dot>
            {running ? "Running" : "Down"}
          </Badge>
          {LINE.splitLine.active ? (
            <Badge tone="success">
              ✓ Split Line Active ({LINE.splitLine.with})
            </Badge>
          ) : (
            <Badge tone="danger">✕ Split Line Inactive</Badge>
          )}
        </div>
      </div>

      <nav className="mes-header__actions" aria-label="Line actions">
        <Button variant="success" size="sm">Request Material</Button>
        <Button variant="success" size="sm">FG Rls A</Button>
        <Button variant="success" size="sm">FG Rls B</Button>
        <Button variant="info" size="sm">Manual Movement</Button>
        <Button variant="warning" size="sm">Split Line</Button>
        <Button variant="danger" size="sm">Finish Work Order</Button>
      </nav>
    </header>
  );
}
