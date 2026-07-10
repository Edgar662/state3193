"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("languages");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="relative flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5">
      <Globe className="h-4 w-4 shrink-0 text-slate-400" />
      <select
        aria-label={t("pt")}
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value })}
        className="cursor-pointer appearance-none bg-transparent pe-1 text-sm font-medium text-slate-200 focus:outline-none"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-slate-900 text-slate-200">
            {t(l)}
          </option>
        ))}
      </select>
    </div>
  );
}
