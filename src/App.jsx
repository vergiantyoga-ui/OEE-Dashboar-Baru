import { useState } from "react";
import DashboardHeader from "./components/header/DashboardHeader.jsx";
import Toast from "./components/ui/Toast.jsx";
import Page1Kpi from "./pages/Page1Kpi.jsx";
import Page2Reason from "./pages/Page2Reason.jsx";
import Page3Reject from "./pages/Page3Reject.jsx";
import "./App.css";

const PAGES = [
  { id: "kpi", label: "Dashboard KPI OEE", icon: "▦" },
  { id: "reason", label: "Input Reason OEE", icon: "◫" },
  { id: "reject", label: "Reject 7-Segments", icon: "◔" },
];

export default function App() {
  const [page, setPage] = useState("kpi");
  const [toast, setToast] = useState("");

  return (
    <div className="app">
      <aside className="app__sidebar" aria-label="Main navigation">
        <div className="app__logo" title="MES FRO">
          <span>OEE</span>
        </div>
        <nav className="app__nav">
          {PAGES.map((p) => (
            <button
              key={p.id}
              className={`app__nav-item ${page === p.id ? "is-active" : ""}`}
              onClick={() => setPage(p.id)}
              aria-current={page === p.id ? "page" : undefined}
              title={p.label}
            >
              <span className="app__nav-icon" aria-hidden>
                {p.icon}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="app__main">
        <DashboardHeader />

        <div className="app__tabs" role="tablist" aria-label="Dashboard pages">
          {PAGES.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={page === p.id}
              className={`app__tab ${page === p.id ? "is-active" : ""}`}
              onClick={() => setPage(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <main className="app__content">
          {page === "kpi" && <Page1Kpi onToast={setToast} />}
          {page === "reason" && <Page2Reason onToast={setToast} />}
          {page === "reject" && <Page3Reject onToast={setToast} />}
        </main>
      </div>

      <Toast message={toast} onDismiss={() => setToast("")} />
    </div>
  );
}
