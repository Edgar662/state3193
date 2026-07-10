import { Building2, FlaskConical, Swords, type LucideIcon } from "lucide-react";
import type { DayKey } from "@/lib/slots";

export const DAY_ICONS: Record<DayKey, LucideIcon> = {
  CONSTRUCTION: Building2,
  RESEARCH: FlaskConical,
  TROOPS: Swords,
};
