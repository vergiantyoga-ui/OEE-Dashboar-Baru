/*
  Mock data for the OEE Dashboard.
  A single coherent scenario: line TUP01 @ Jatake-2 / Zona A, Shift 1,
  running Process Order 210000000212 (KAHF Facial Wash).

  All numbers here feed the OEE engine (src/lib/oee.js) so the dashboard
  stays internally consistent instead of showing disconnected fake values.
*/

import {
  computeMachineOEE,
  computeWeightedOEE,
  sumWindows,
} from "../lib/oee.js";

export const LINE = {
  id: "TUP01",
  plant: "Jatake-2",
  zone: "Zona A",
  status: "running", // running | down
  splitLine: { active: true, with: "TUP05" },
};

export const SHIFT = {
  no: 1,
  label: "Shift 1 — Normal Shift (07:00 - 15:00)",
  startHour: 7,
  targetOutput: 50000,
};

export const PROCESS_ORDER = {
  code: "210000000212",
  fgCode: "210000000211",
  batch: "LN15A",
  skuName: "KAHF Facial Wash Acnederm 60 ML",
  skuCode: "MDM - HGL",
  material: "4000000021",
  mpq: 150000,
  standardRunRateSku: 110, // pcs/min
  standardRunRateLine: 60, // bottleneck machine
  startTime: "07:15:00",
  estFinish: "14:30:00",
  remaining: "01:44:48",
};

export const OPERATORS = [
  "FTRI",
  "ADQI",
  "YUAB",
  "JRWO",
  "GSTI",
  "INDH",
  "BRHN",
  "ANDI",
  "ICAK",
  "SANE",
];

/* ---- Machines on the line (drives OEE Line detail) ---- */
export const MACHINES = [
  { id: "LTF01", name: "Labelling TF-01", stdRunRate: 60, weight: 100 },
  { id: "LSP01", name: "Sleeve Packer-01", stdRunRate: 72, weight: 100 },
  { id: "LBC01", name: "Box Cartoner-01", stdRunRate: 80, weight: 80 },
];

/*
  Deterministic pseudo-random so the demo is stable across reloads.
*/
function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/*
  Build a plausible set of classified sampling windows for a machine across
  a shift's elapsed time. Returns { windows, quality } for the OEE engine.
*/
function buildMachineWindows(machine, elapsedMin, seed) {
  const rand = seeded(seed);
  const windowSec = 30;
  const nWindows = Math.round((elapsedMin * 60) / windowSec);
  const windows = [];
  let totalUnit = 0;

  const stdPerWindow = (windowSec * machine.stdRunRate) / 60;

  for (let i = 0; i < nWindows; i++) {
    const r = rand();
    let code;
    let output = 0;
    if (r < 0.06) {
      code = "NA";
    } else if (r < 0.1) {
      code = "US";
    } else if (r < 0.14) {
      code = "PD";
    } else if (r < 0.2) {
      code = "D";
    } else if (r < 0.28) {
      code = "MS";
    } else if (r < 0.45) {
      code = "SL";
      output = Math.floor(stdPerWindow * (0.3 + rand() * 0.4));
    } else {
      code = "EF";
      output = Math.ceil(stdPerWindow * (1 + rand() * 0.15));
    }
    windows.push({ code, seconds: windowSec });
    totalUnit += output;
  }

  const reject = Math.round(totalUnit * 0.012);
  const rework = Math.round(totalUnit * 0.004);

  return {
    windows,
    qualityData: { totalUnit, reject, rework },
  };
}

/*
  Compute the full OEE snapshot for the current scenario at a given elapsed
  minute count (defaults to a realistic mid-shift value).
*/
export function buildOeeSnapshot(elapsedMin = 210) {
  const perMachine = MACHINES.map((m, idx) => {
    const { windows, qualityData } = buildMachineWindows(m, elapsedMin, idx + 7);
    const sums = sumWindows(windows);
    const metrics = computeMachineOEE(elapsedMin, sums, qualityData);
    return {
      machine: m,
      windows,
      sums,
      qualityData, // { totalUnit, reject, rework }
      // OEE component percentages
      availability: metrics.availability,
      performance: metrics.performance,
      quality: metrics.quality, // Quality % (0..1)
      oee: metrics.oee,
      spt: metrics.spt,
      got: metrics.got,
      not: metrics.not,
    };
  });

  // Line OEE — OR method weighted roll-up (PRD Bab 5.4)
  const line = computeWeightedOEE(
    perMachine.map((pm) => ({
      got: pm.got,
      spt: pm.spt,
      not: pm.not,
      totalUnit: pm.qualityData.totalUnit,
      reject: pm.qualityData.reject,
      rework: pm.qualityData.rework,
      weight: pm.machine.weight,
    }))
  );

  const totalOutput = perMachine.reduce(
    (a, pm) => a + pm.qualityData.totalUnit,
    0
  );
  const totalReject = perMachine.reduce(
    (a, pm) => a + pm.qualityData.reject,
    0
  );

  return { perMachine, line, totalOutput, totalReject, elapsedMin };
}

/* ---- IDW packing counters (PRD A3.2) ---- */
export const IDW = {
  innerBox: { actual: 0, target: 0 },
  kartonBox: { actual: 95, target: 120 },
  pallet: { actual: 8, target: 10 },
  outputIdw: 35420,
  outputOee: 36100,
  totalMpq: 150000,
};

/* ---- QA inspection running counters (PRD A3.1.5 / A2.7) ---- */
export const QA = {
  sample: 35,
  released: 33,
  reject: 2,
  currentSampleNo: 35,
  intervalPcs: 5000,
};

/* ---- Downtime overview rows (PRD Bab 8.2) ---- */
export const DOWNTIME_EVENTS = [
  {
    id: "dt-1",
    range: "10:30 - 10:36",
    durationMin: 6,
    status: "uncommented",
    machine: "LTF01",
  },
  {
    id: "dt-2",
    range: "09:12 - 09:15",
    durationMin: 3,
    status: "uncommented",
    machine: "LSP01",
  },
  {
    id: "dt-3",
    range: "08:45 - 08:55",
    durationMin: 10,
    status: "uncommented",
    machine: "LTF01",
  },
  {
    id: "dt-4",
    range: "07:40 - 07:52",
    durationMin: 12,
    status: "planned",
    machine: "LBC01",
    reason: "Breakdown / Conveyor Breakdown",
  },
];

export const DOWNTIME_CATEGORIES = [
  { id: "breakdown", label: "Breakdown", reasons: ["Conveyor Breakdown", "Motor Failure", "Sensor Failure", "E-Stop Actuated"] },
  { id: "planned", label: "Planned Down Time", reasons: ["Scheduled Maintenance", "Meal Break", "Shift Change"] },
  { id: "unscheduled", label: "Unscheduled", reasons: ["Waiting Material", "Waiting Operator"] },
  { id: "setup", label: "Set Up", reasons: ["Changeover", "First Article Setup"] },
  { id: "unutilized", label: "Unutilized", reasons: ["No Plan", "Line Idle"] },
];

export const REJECT_CATEGORIES = [
  { id: "quality", label: "Quality", reasons: ["Contamination", "Fill Weight Off"] },
  { id: "process", label: "Process", reasons: ["Scratch on Surface", "Dent / Deformation", "Incomplete Assembly"] },
  { id: "material", label: "Material", reasons: ["Wrong Component", "Defective Cap"] },
  { id: "handling", label: "Handling", reasons: ["Drop Damage", "Crushed Box"] },
  { id: "environment", label: "Environment", reasons: ["Humidity", "Temperature"] },
];

/* Standard run rate (pcs/min) shown in the Production Signal tooltip. */
export const STD_RUN_RATE_DISPLAY = 80;

/** Format an hour + minute-offset into "HH:MM", carrying past 60. */
function clock(hour, minute) {
  const hh = (((hour + Math.floor(minute / 60)) % 24) + 24) % 24;
  const mm = minute % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/* ---- Stacked-bar timeline per hour (PRD Bab 8.1) ---- */
export function buildTimeline(startHour = 7, hours = 8, seed = 42) {
  const rand = seeded(seed);
  const codesPool = ["EF", "EF", "EF", "SL", "MS", "D", "PD"];
  const rows = [];
  let cumOutput = 0;
  let cumReject = 0;

  for (let h = 0; h < hours; h++) {
    // each hour is 60 minute-segments; group into a handful of colored bands
    const bands = [];
    let mLeft = 60;
    let acc = 0; // minutes consumed within this hour
    let idx = 0;

    while (mLeft > 0) {
      const span = Math.min(mLeft, 3 + Math.floor(rand() * 12));
      const code = codesPool[Math.floor(rand() * codesPool.length)];
      const producing = code === "EF" || code === "SL";
      const output = producing ? span * (80 + Math.floor(rand() * 40)) : 0;

      bands.push({
        id: `${startHour + h}-${idx}`,
        code,
        minutes: span,
        output,
        startTime: clock(startHour + h, acc),
        endTime: clock(startHour + h, acc + span),
        reason: null, // filled in when the operator classifies this segment
      });

      acc += span;
      mLeft -= span;
      idx += 1;
    }

    const rowOutput = bands.reduce((a, b) => a + b.output, 0);
    const rowReject = rand() < 0.4 ? Math.floor(rand() * 6) + 1 : 0;

    // running cumulative totals for the tooltip's "Total Output (Total Reject)"
    let running = cumOutput;
    for (const b of bands) {
      running += b.output;
      b.cumOutput = running;
      b.cumReject = cumReject + rowReject;
    }
    cumOutput = running;
    cumReject += rowReject;

    rows.push({
      hour: clock(startHour + h, 0),
      bands,
      output: rowOutput,
      scheduledMin: bands
        .filter((b) => b.code === "EF")
        .reduce((a, b) => a + b.minutes, 0),
      hasReject: rowReject > 0,
      reject: rowReject,
      poStart: h === 0,
    });
  }
  return rows;
}

/* ---- Reject 7-segment dashboard (PRD Bab 9) ---- */
export const REJECT_KPI = {
  output: 35420,
  segments: [
    { key: "seal", label: "Reject Seal", value: 18 },
    { key: "netto", label: "Netto Kurang / Penyok", value: 7 },
    { key: "baret", label: "Baret", value: 11 },
    { key: "bintik", label: "Bintik", value: 4 },
    { key: "miring", label: "Miring", value: 9 },
    { key: "kotor", label: "Kotor", value: 3 },
    { key: "penyok", label: "Penyok Tutup", value: 5 },
  ],
};

export function buildRejectTrend(seed = 7) {
  const rand = seeded(seed);
  const hours = ["07", "08", "09", "10", "11", "12", "13", "14"];
  return REJECT_KPI.segments.map((seg) => ({
    ...seg,
    trend: hours.map((h) => ({
      hour: h,
      value: Math.floor(rand() * (seg.value / 2 + 3)),
    })),
  }));
}
