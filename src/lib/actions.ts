"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";

export async function adminLogin(locale: string, username: string, password: string) {
  try {
    await signIn("credentials", { username, password, redirectTo: `/${locale}/admin` });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "invalid" as const };
    }
    throw error;
  }
}

export async function adminLogout(locale: string) {
  await signOut({ redirectTo: `/${locale}` });
}
