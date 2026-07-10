import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const event = await prisma.event.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!event) {
    return NextResponse.json({ event: null, bookings: [] });
  }

  const bookings = await prisma.booking.findMany({
    where: { eventId: event.id },
    select: { day: true, slot: true, playerName: true, alliance: true },
  });

  return NextResponse.json({ event, bookings });
}
