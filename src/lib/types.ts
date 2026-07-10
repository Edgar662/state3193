import type { DayKey } from "@/lib/slots";

export type PublicBooking = {
  day: DayKey;
  slot: number;
  playerName: string;
  alliance: string;
};

export type ActiveEventResponse = {
  event: { id: string; label: string; startDate: string; isActive: boolean; createdAt: string } | null;
  bookings: PublicBooking[];
};

export type AdminBooking = {
  id: string;
  day: DayKey;
  slot: number;
  gameId: string;
  playerName: string;
  alliance: string;
  createdAt: string;
};

export type AdminEvent = {
  id: string;
  label: string;
  startDate: string;
  isActive: boolean;
  createdAt: string;
  bookings: AdminBooking[];
};
