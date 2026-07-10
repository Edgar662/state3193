export const DAYS = ["CONSTRUCTION", "RESEARCH", "TROOPS"] as const;
export type DayKey = (typeof DAYS)[number];

export const SLOT_COUNT = 48;

/** Slot index 0-47 -> "HH:MM" em UTC (00:00, 00:30, ... 23:30). */
export function slotToLabel(slot: number): string {
  const hours = Math.floor(slot / 2);
  const minutes = slot % 2 === 0 ? "00" : "30";
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

export function currentMonthLabel(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

const DAY_OFFSET: Record<DayKey, number> = {
  CONSTRUCTION: 0,
  RESEARCH: 1,
  TROOPS: 2,
};

/** Data (UTC) de um dos 3 dias do evento, a partir da data de inicio (dia de Construcao). */
export function dateForDay(startDate: Date | string, day: DayKey): Date {
  const start = new Date(startDate);
  const result = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
  );
  result.setUTCDate(result.getUTCDate() + DAY_OFFSET[day]);
  return result;
}

export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "UTC" }).format(date);
}

/** Instante exato (UTC) de um slot, combinando a data do dia com o horario do slot. */
export function slotToDate(dayDate: Date, slot: number): Date {
  const hours = Math.floor(slot / 2);
  const minutes = slot % 2 === 0 ? 0 : 30;
  return new Date(Date.UTC(dayDate.getUTCFullYear(), dayDate.getUTCMonth(), dayDate.getUTCDate(), hours, minutes));
}

/** "HH:MM" de um instante no fuso horario local do navegador, mais o deslocamento de dia (-1, 0, +1) em relacao a data UTC do slot. */
export function toLocalTime(date: Date, locale: string): { time: string; dayOffset: number } {
  const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  const utcDay = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const localDayAsUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOffset = Math.round((localDayAsUtc - utcDay) / 86_400_000);
  return { time, dayOffset };
}
