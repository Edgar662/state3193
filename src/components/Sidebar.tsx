"use client";

import { CalendarDays, ChevronDown, Info, Mountain } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const STATE_NUMBER = process.env.NEXT_PUBLIC_STATE_NUMBER;

export function Sidebar() {
  const t = useTranslations("nav");
  const tLang = useTranslations("languages");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("schedule"), icon: CalendarDays },
    { href: "/how-it-works", label: t("howItWorks"), icon: Info },
  ] as const;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-e border-slate-800 bg-[#0d1526]">
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-6">
        <Mountain className="h-8 w-8 text-blue-500" />
        <div>
          <p className="text-sm font-bold leading-tight text-slate-100">WHITEOUT SURVIVAL</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">{t("subtitle")}</p>
        </div>
      </div>

      {STATE_NUMBER && (
        <div className="border-b border-slate-800 px-5 py-3 text-xs font-medium text-slate-400">
          {t("state", { number: STATE_NUMBER })}
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}

        <div>
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <span className="flex items-center gap-3">
              <ChevronDown className={`h-4 w-4 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              {t("language")}
            </span>
          </button>
          {langOpen && (
            <div className="mt-1 ms-4 space-y-0.5 border-s border-slate-800 ps-3">
              {routing.locales.map((l) => (
                <button
                  key={l}
                  onClick={() => router.replace(pathname, { locale: l })}
                  className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${
                    l === locale ? "text-blue-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tLang(l)}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-slate-800 px-5 py-4 text-[11px] text-slate-500">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </aside>
  );
}
