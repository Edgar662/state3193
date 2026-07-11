"use client";

import { History } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { slotToLabel } from "@/lib/slots";
import type { AuditLogEntry } from "@/lib/types";

export function AuditLogViewer() {
  const t = useTranslations("auditLog");
  const tDays = useTranslations("days");
  const locale = useLocale();

  const [entries, setEntries] = useState<AuditLogEntry[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/audit-log", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { entries: AuditLogEntry[] } | null) => setEntries(json?.entries ?? []));
  }, []);

  if (!entries) return null;

  return (
    <div className="mt-10 rounded-lg border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-slate-100">
        <History className="h-5 w-5 text-blue-500" />
        {t("title")}
      </h2>
      <p className="mb-4 text-sm text-slate-400">{t("subtitle")}</p>

      <div className="overflow-x-auto rounded-md border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/70 text-slate-400">
            <tr>
              <th className="px-3 py-2">{t("when")}</th>
              <th className="px-3 py-2">{t("admin")}</th>
              <th className="px-3 py-2">{t("action")}</th>
              <th className="px-3 py-2">{t("event")}</th>
              <th className="px-3 py-2">{t("day")}</th>
              <th className="px-3 py-2">{t("time")}</th>
              <th className="px-3 py-2">{t("gameId")}</th>
              <th className="px-3 py-2">{t("playerName")}</th>
              <th className="px-3 py-2">{t("alliance")}</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-4 text-center text-slate-500">
                  {t("empty")}
                </td>
              </tr>
            )}
            {entries.map((entry) => (
              <tr key={entry.id} className="border-t border-slate-800 text-slate-300">
                <td className="px-3 py-2 whitespace-nowrap">
                  {new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }).format(
                    new Date(entry.createdAt)
                  )}
                </td>
                <td className="px-3 py-2">{entry.adminUsername}</td>
                <td className="px-3 py-2 text-red-400">{t("actionDeleted")}</td>
                <td className="px-3 py-2">{entry.eventLabel}</td>
                <td className="px-3 py-2">{tDays(entry.day)}</td>
                <td className="px-3 py-2 font-mono">{slotToLabel(entry.slot)}</td>
                <td className="px-3 py-2">{entry.gameId}</td>
                <td className="px-3 py-2">{entry.playerName}</td>
                <td className="px-3 py-2">{entry.alliance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
