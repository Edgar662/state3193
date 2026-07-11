import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { event: { select: { label: true } } },
  });
  if (!booking) {
    return NextResponse.json({ ok: true });
  }

  await prisma.$transaction([
    prisma.auditLog.create({
      data: {
        action: "booking.deleted",
        adminId: session.user.id,
        adminUsername: session.user.name ?? "",
        eventLabel: booking.event.label,
        day: booking.day,
        slot: booking.slot,
        gameId: booking.gameId,
        playerName: booking.playerName,
        alliance: booking.alliance,
      },
    }),
    prisma.booking.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}
