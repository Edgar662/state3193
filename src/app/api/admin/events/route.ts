import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { currentMonthLabel } from "@/lib/slots";
import { createEventInputSchema } from "@/lib/validation";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: { bookings: { orderBy: [{ day: "asc" }, { slot: "asc" }] } },
  });

  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  const parsed = createEventInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const startDate = new Date(`${parsed.data.startDate}T00:00:00.000Z`);

  const event = await prisma.$transaction(async (tx) => {
    await tx.event.updateMany({ where: { isActive: true }, data: { isActive: false } });
    return tx.event.create({
      data: { label: currentMonthLabel(startDate), startDate, isActive: true },
    });
  });

  return NextResponse.json({ event }, { status: 201 });
}
