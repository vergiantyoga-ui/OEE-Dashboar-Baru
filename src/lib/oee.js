/*
  OEE calculation engine (PRD Bab 5).
  Pure functions — no side effects, easy to unit-test.

  Window classification codes:
    NA  Not Available   (sensor off)
    US  Unscheduled     (sensor on, machine off)
    SL  Speed Loss      (actual output < standard output)
    EF  Effective       (actual output >= standard output)
    MS  Minor Stop      (no output <= 10 min)
    D   Downtime        (no output > 10 min)
    PD  Planned Downtime (operator-tagged)
*/

export const WINDOW_CODES = ["NA", "US", "SL", "EF", "MS", "D", "PD"];

export const WINDOW_META = {
  NA: { label: "Not Available", color: "var(--oee-na)", key: "na" },
  US: { label: "Unscheduled", color: "var(--oee-planned)", key: "us" },
  SL: { label: "Speed Loss", color: "var(--oee-speedloss)", key: "sl" },
  EF: { label: "Effective", color: "var(--oee-effective)", key: "ef" },
  MS: { label: "Minor Stop", color: "var(--oee-minorstop)", key: "ms" },
  D: { label: "Downtime", color: "var(--oee-downtime)", key: "d" },
  PD: { label: "Planned Downtime", color: "var(--oee-planned)", key: "pd" },
};

/** Standard output for one sampling window. */
export function standardOutputPerWindow(windowSeconds, standardRunRatePpm) {
  return (windowSeconds * standardRunRatePpm) / 60;
}

/**
 * Aggregate an array of classified windows (each { code, seconds }) into
 * the sums the OEE formulas need. Returns minutes.
 */
export function sumWindows(windows) {
  const totals = { NA: 0, US: 0, SL: 0, EF: 0, MS: 0, D: 0, PD: 0 };
  for (const w of windows) {
    totals[w.code] += w.seconds;
  }
  // convert seconds -> minutes
  const min = {};
  for (const k of WINDOW_CODES) min[k] = totals[k] / 60;
  return min;
}

/**
 * Compute Availability / Performance / Quality / OEE for a single machine.
 * @param {number} timeframeMin  chosen timeframe in minutes
 * @param {object} sums          minutes per window code (from sumWindows)
 * @param {object} quality       { totalUnit, reject, rework }
 */
export function computeMachineOEE(timeframeMin, sums, quality) {
  const { NA, US, SL, EF, MS, D, PD } = sums;

  const spt = timeframeMin - NA - US - PD; // Scheduled Production Time
  const got = spt - D; // Gross Operating Time
  const not = got - MS - SL; // Net Operating Time

  const availability = spt > 0 ? got / spt : 0;
  const performance = got > 0 ? not / got : 0;

  const { totalUnit, reject, rework } = quality;
  const qualityPct =
    totalUnit > 0 ? (totalUnit - reject - rework) / totalUnit : 0;

  const oee = availability * performance * qualityPct;

  return {
    spt,
    got,
    not,
    availability: clamp01(availability),
    performance: clamp01(performance),
    quality: clamp01(qualityPct),
    oee: clamp01(oee),
    effectiveMin: EF, // exposed for charts
  };
}

/**
 * Weighted roll-up for Line (OR method) / Zone / Overall (PRD Bab 5.4-5.6).
 * @param {Array} machines  each { got, spt, not, totalUnit, reject, rework, weight }
 */
export function computeWeightedOEE(machines) {
  let gW = 0,
    sW = 0,
    nW = 0,
    qNumW = 0,
    qDenW = 0;

  for (const m of machines) {
    const w = m.weight ?? 100;
    gW += m.got * w;
    sW += m.spt * w;
    nW += m.not * w;
    qNumW += (m.totalUnit - m.reject - m.rework) * w;
    qDenW += m.totalUnit * w;
  }

  const availability = sW > 0 ? gW / sW : 0;
  const performance = gW > 0 ? nW / gW : 0;
  const quality = qDenW > 0 ? qNumW / qDenW : 0;

  return {
    availability: clamp01(availability),
    performance: clamp01(performance),
    quality: clamp01(quality),
    oee: clamp01(availability * performance * quality),
  };
}

/** Actual run rate = ROUNDUP( total output / minutes elapsed ). PRD A3.1.3 */
export function actualRunRate(totalOutput, minutesElapsed) {
  if (minutesElapsed <= 0) return 0;
  return Math.ceil(totalOutput / minutesElapsed);
}

/** Target catch-up run rate = ROUNDUP( remaining target / remaining minutes ). */
export function targetRunRate(mpq, actualOutput, remainingMinutes) {
  if (remainingMinutes <= 0) return 0;
  return Math.ceil((mpq - actualOutput) / remainingMinutes);
}

/** Remaining time to finish PO (minutes). PRD A3.1.6 */
export function remainingMinutes(mpq, actualOutput, runRatePerMin) {
  if (runRatePerMin <= 0) return 0;
  const rem = (mpq - actualOutput) / runRatePerMin;
  return rem > 0 ? rem : 0;
}

function clamp01(v) {
  if (Number.isNaN(v) || !Number.isFinite(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

export function pct(v, digits = 1) {
  return `${(v * 100).toFixed(digits)}%`;
}
