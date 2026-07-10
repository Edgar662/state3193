import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { DayKey } from "@/lib/slots";

type CreateBookingParams = {
  eventId: string;
  day: DayKey;
  slot: number;
  gameId: string;
  playerName: string;
  alliance: string;
};

export async function createBookingOrError({ eventId, day, slot, gameId, playerName, alliance }: CreateBookingParams) {
  try {
    const booking = await prisma.booking.create({
      data: { eventId, day, slot, gameId, playerName, alliance },
    });
    return { booking, error: null } as const;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const target = (err.meta?.target as string[] | undefined) ?? [];
      if (target.includes("slot")) {
        return { booking: null, error: "slot_taken" as const };
      }
      if (target.includes("gameId")) {
        return { booking: null, error: "id_already_booked_today" as const };
      }
    }
    throw err;
  }
}
