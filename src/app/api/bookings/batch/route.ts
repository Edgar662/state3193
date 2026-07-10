import { NextResponse } from "next/server";
import { createBookingOrError } from "@/lib/booking";
import { prisma } from "@/lib/prisma";
import { batchBookingInputSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = batchBookingInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const { gameId, playerName, alliance, days, slot } = parsed.data;

  const event = await prisma.event.findFirst({ where: { isActive: true } });
  if (!event) {
    return NextResponse.json({ error: "no_active_event" }, { status: 409 });
  }

  const results = [];
  for (const day of days) {
    const result = await createBookingOrError({ eventId: event.id, day, slot, gameId, playerName, alliance });
    results.push({ day, error: result.error });
  }

  return NextResponse.json({ results });
}
