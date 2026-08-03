/** Number with thousands separators (id-ID style). */
export function num(n) {
  return new Intl.NumberFormat("id-ID").format(Math.round(n));
}

/** Minutes -> "HH:MM:SS" duration string. */
export function minutesToClock(mins) {
  const totalSec = Math.max(0, Math.round(mins * 60));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((x) => String(x).padStart(2, "0")).join(":");
}

/** Date -> "HH:MM:SS" */
export function timeHMS(date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/** Date -> "Senin, 30 Maret 2026" */
export function dateLong(date) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Which shift is a given hour in (PRD Bab 6). */
export function shiftForHour(hour) {
  if (hour >= 7 && hour < 15) return { no: 1, label: "07:00 – 15:00" };
  if (hour >= 15 && hour < 23) return { no: 2, label: "15:00 – 23:00" };
  return { no: 3, label: "23:00 – 07:00" };
}
