import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const target = await prisma.event.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const event = await prisma.$transaction(async (tx) => {
    await tx.event.updateMany({ where: { isActive: true }, data: { isActive: false } });
    return tx.event.update({ where: { id }, data: { isActive: true } });
  });

  return NextResponse.json({ event });
}
