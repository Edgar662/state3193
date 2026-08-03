export const DAYS = ["CONSTRUCTION", "RESEARCH", "TROOPS"] as const;
export type DayKey = (typeof DAYS)[number];

export const SLOT_COUNT = 48;

/** Nomes em ingles, usados quando o texto precisa ser sempre em ingles (ex: copiar pra compartilhar). */
export const ENGLISH_DAY_NAMES: Record<DayKey, string> = {
  CONSTRUCTION: "Construction",
  RESEARCH: "Research",
  TROOPS: "Troops",
};

/** Slot index 0-47 -> "HH:MM" em UTC (00:00, 00:30, ... 23:30). */
export function slotToLabel(slot: number): string {
  const hours = Math.floor(slot / 2);
  const minutes = slot % 2 === 0 ? "00" : "30";
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

export function currentMonthLabel(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export type EventDates = {
  constructionDate: Date | string;
  researchDate: Date | string;
  troopsDate: Date | string;
};

const DAY_FIELD: Record<DayKey, keyof EventDates> = {
  CONSTRUCTION: "constructionDate",
  RESEARCH: "researchDate",
  TROOPS: "troopsDate",
};

/** Data (UTC) de um dos 3 dias do evento — cada dia tem sua propria data, nao necessariamente consecutivas. */
export function dateForDay(event: EventDates, day: DayKey): Date {
  return new Date(event[DAY_FIELD[day]]);
}

export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "UTC" }).format(date);
}

export function formatShortDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", timeZone: "UTC" }).format(date);
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
