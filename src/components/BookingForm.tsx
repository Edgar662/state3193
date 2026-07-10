"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { bookingInputSchema, type BookingInput } from "@/lib/validation";
import { DAYS, slotToLabel, type DayKey } from "@/lib/slots";

type Props = {
  day: DayKey;
  slot: number;
  onCancel: () => void;
  onSuccess: () => void;
};

type BatchResult = { day: DayKey; error: string | null };

export function BookingForm({ day, slot, onCancel, onSuccess }: Props) {
  const t = useTranslations("form");
  const tDays = useTranslations("days");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [allDays, setAllDays] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchResult[] | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingInputSchema),
    defaultValues: { day, slot, gameId: "", playerName: "", alliance: "" },
  });

  const gameIdField = register("gameId");
  const allianceField = register("alliance");

  async function onSubmit(data: BookingInput) {
    setSubmitting(true);
    setErrorKey(null);
    try {
      if (allDays) {
        const res = await fetch("/api/bookings/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId: data.gameId,
            playerName: data.playerName,
            alliance: data.alliance,
            slot: data.slot,
            days: DAYS,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setErrorKey(body.error ?? "generic");
          return;
        }
        const body: { results: BatchResult[] } = await res.json();
        setBatchResults(body.results);
        return;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorKey(body.error ?? "generic");
        return;
      }
      onSuccess();
    } catch {
      setErrorKey("generic");
    } finally {
      setSubmitting(false);
    }
  }

  if (batchResults) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">{t("resultsTitle")}</h2>
          <ul className="mb-4 space-y-2">
            {batchResults.map(({ day: d, error }) => (
              <li key={d} className="flex items-center gap-2 text-sm">
                {error ? (
                  <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                )}
                <span className="text-slate-200">{tDays(d)}:</span>
                <span className={error ? "text-red-400" : "text-emerald-400"}>
                  {error ? t(`errors.${error}` as Parameters<typeof t>[0]) : t("success")}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end">
            <button
              onClick={onSuccess}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">{t("title")}</h2>
        <p className="mb-4 text-sm text-slate-400">
          {tDays(day)} — {slotToLabel(slot)} UTC
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">{t("gameId")}</label>
            <input
              {...gameIdField}
              inputMode="numeric"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
                gameIdField.onChange(e);
              }}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100"
            />
            {errors.gameId ? (
              <p className="mt-1 text-xs text-red-400">{t("errors.invalid_input")}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">{t("gameIdHint")}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">{t("playerName")}</label>
            <input
              {...register("playerName")}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100"
            />
            {errors.playerName && (
              <p className="mt-1 text-xs text-red-400">{t("errors.invalid_input")}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">{t("alliance")}</label>
            <input
              {...allianceField}
              maxLength={3}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3);
                allianceField.onChange(e);
              }}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 uppercase text-slate-100"
            />
            {errors.alliance ? (
              <p className="mt-1 text-xs text-red-400">{t("errors.invalid_input")}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">{t("allianceHint")}</p>
            )}
          </div>

          <label className="flex items-start gap-2 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={allDays}
              onChange={(e) => setAllDays(e.target.checked)}
              className="mt-0.5"
            />
            {t("allDaysCheckbox", { time: `${slotToLabel(slot)} UTC` })}
          </label>

          {errorKey && (
            <p className="text-sm text-red-400">
              {t(`errors.${errorKey}` as Parameters<typeof t>[0])}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? t("submitting") : t("submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
