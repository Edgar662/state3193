import { CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AdminLinkButton } from "@/components/AdminLinkButton";

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("howItWorks");
  const rules = t.raw("rules") as string[];

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

      <div className="mx-auto w-full max-w-2xl flex-1 p-8">
        <p className="mb-6 text-sm leading-relaxed text-slate-300">{t("intro")}</p>

        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t("rulesTitle")}
        </h2>
        <ul className="space-y-3">
          {rules.map((rule, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
              <span className="text-sm text-slate-300">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
