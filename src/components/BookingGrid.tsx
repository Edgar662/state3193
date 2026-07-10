"use client";

import { CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DAYS,
  SLOT_COUNT,
  slotToLabel,
  dateForDay,
  formatDate,
  slotToDate,
  toLocalTime,
  type DayKey,
} from "@/lib/slots";
import { DAY_ICONS } from "@/lib/dayIcons";
import type { ActiveEventResponse, PublicBooking } from "@/lib/types";
import { BookingForm } from "@/components/BookingForm";
import { PageHeader } from "@/components/PageHeader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AdminLinkButton } from "@/components/AdminLinkButton";

type TimeMode = "utc" | "local";

export function BookingGrid() {
  const t = useTranslations("home");
  const tDays = useTranslations("days");
  const locale = useLocale();

  const [data, setData] = useState<ActiveEventResponse | null>(null);
  const [activeDay, setActiveDay] = useState<DayKey>("CONSTRUCTION");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [timeMode, setTimeMode] = useState<TimeMode>("utc");

  const localTzLabel = useMemo(() => {
    const part = new Intl.DateTimeFormat(locale, { timeZoneName: "shortOffset" })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName");
    return part?.value ?? "Local";
  }, [locale]);

  const load = useCallback(async () => {
    const res = await fetch("/api/events/active", { cache: "no-store" });
    const json: ActiveEventResponse = await res.json();
    setData(json);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dayDate = data?.event ? dateForDay(data.event.startDate, activeDay) : null;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <>
            <LanguageSwitcher />
            <AdminLinkButton />
          </>
        }
      />

      {!data ? null : !data.event ? (
        <p className="p-8 text-center text-slate-400">{t("noEvent")}</p>
      ) : (
        <div className="mx-auto w-full max-w-3xl flex-1 p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {DAYS.map((day) => {
                const Icon = DAY_ICONS[day];
                const active = activeDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tDays(day)}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              {dayDate && formatDate(dayDate, locale)}
            </div>
          </div>

          <div className="mb-4 flex justify-end">
            <div className="inline-flex overflow-hidden rounded-full border border-slate-700 text-xs font-medium">
              <button
                onClick={() => setTimeMode("utc")}
                className={`px-3 py-1.5 ${timeMode === "utc" ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:text-slate-200"}`}
              >
                UTC
              </button>
              <button
                onClick={() => setTimeMode("local")}
                className={`px-3 py-1.5 ${timeMode === "local" ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:text-slate-200"}`}
              >
                {localTzLabel}
              </button>
            </div>
          </div>

          {dayDate && (
            <SlotList
              bookings={data.bookings.filter((b) => b.day === activeDay)}
              onPick={setSelectedSlot}
              dayDate={dayDate}
              timeMode={timeMode}
              locale={locale}
            />
          )}

          <p className="mt-6 text-center text-xs text-slate-500">{t("oneSlotNote")}</p>
        </div>
      )}

      {selectedSlot !== null && (
        <BookingForm
          day={activeDay}
          slot={selectedSlot}
          onCancel={() => setSelectedSlot(null)}
          onSuccess={() => {
            setSelectedSlot(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function SlotList({
  bookings,
  onPick,
  dayDate,
  timeMode,
  locale,
}: {
  bookings: PublicBooking[];
  onPick: (slot: number) => void;
  dayDate: Date;
  timeMode: TimeMode;
  locale: string;
}) {
  const t = useTranslations("home");
  const bySlot = new Map(bookings.map((b) => [b.slot, b]));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-800">
      {Array.from({ length: SLOT_COUNT }, (_, slot) => {
        const booking = bySlot.get(slot);
        const taken = Boolean(booking);

        let timeLabel: string;
        let dayOffset = 0;
        if (timeMode === "utc") {
          timeLabel = `${slotToLabel(slot)} UTC`;
        } else {
          const local = toLocalTime(slotToDate(dayDate, slot), locale);
          timeLabel = local.time;
          dayOffset = local.dayOffset;
        }

        return (
          <div
            key={slot}
            className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/40 px-5 py-3 last:border-b-0"
          >
            <span className="w-28 shrink-0 font-mono text-sm text-slate-300">
              {timeLabel}
              {dayOffset !== 0 && (
                <span className="ms-1 text-xs text-amber-400">{dayOffset > 0 ? `+${dayOffset}d` : `${dayOffset}d`}</span>
              )}
            </span>
            <span className="flex flex-1 items-center gap-2 text-sm">
              <span className={`h-2 w-2 rounded-full ${taken ? "bg-red-500" : "bg-emerald-500"}`} />
              <span className={taken ? "text-red-400" : "text-emerald-400"}>
                {taken ? t("slotTaken") : t("slotFree")}
              </span>
              {taken && (
                <span className="text-slate-400">
                  {booking!.playerName} ({booking!.alliance})
                </span>
              )}
            </span>
            <button
              disabled={taken}
              onClick={() => onPick(slot)}
              className={`shrink-0 rounded-md border px-4 py-1.5 text-sm font-medium ${
                taken
                  ? "cursor-not-allowed border-slate-800 text-slate-600"
                  : "border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {taken ? t("unavailable") : t("book")}
            </button>
          </div>
        );
      })}
    </div>
  );
}
