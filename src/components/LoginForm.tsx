"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { adminLogin } from "@/lib/actions";

export function LoginForm() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(false);
    startTransition(async () => {
      const username = String(formData.get("username") ?? "");
      const password = String(formData.get("password") ?? "");
      const result = await adminLogin(locale, username, password);
      if (result?.error) setError(true);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-6"
    >
      <h1 className="mb-4 text-lg font-semibold text-slate-100">{t("loginTitle")}</h1>
      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium text-slate-300">{t("username")}</label>
        <input
          name="username"
          required
          className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100"
        />
      </div>
      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium text-slate-300">{t("password")}</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100"
        />
      </div>
      {error && <p className="mb-3 text-sm text-red-400">{t("loginError")}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {t("loginButton")}
      </button>
    </form>
  );
}
