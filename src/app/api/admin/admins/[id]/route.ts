import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/requireAdmin";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSuperAdmin();
  if (response) return response;

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json({ error: "cannot_delete_self" }, { status: 400 });
  }

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ ok: true });
  }

  if (target.isSuperAdmin) {
    const superAdminCount = await prisma.admin.count({ where: { isSuperAdmin: true } });
    if (superAdminCount <= 1) {
      return NextResponse.json({ error: "last_super_admin" }, { status: 400 });
    }
  }

  await prisma.admin.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
