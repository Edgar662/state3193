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
  const constructionDate = new Date(`${parsed.data.constructionDate}T00:00:00.000Z`);
  const researchDate = new Date(`${parsed.data.researchDate}T00:00:00.000Z`);
  const troopsDate = new Date(`${parsed.data.troopsDate}T00:00:00.000Z`);
  const earliestDate = new Date(Math.min(constructionDate.getTime(), researchDate.getTime(), troopsDate.getTime()));

  const event = await prisma.$transaction(async (tx) => {
    await tx.event.updateMany({ where: { isActive: true }, data: { isActive: false } });
    return tx.event.create({
      data: {
        label: currentMonthLabel(earliestDate),
        constructionDate,
        researchDate,
        troopsDate,
        isActive: true,
      },
    });
  });

  return NextResponse.json({ event }, { status: 201 });
}
