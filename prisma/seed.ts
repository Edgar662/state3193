import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { currentMonthLabel } from "../src/lib/slots";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";

  const existingAdmin = await prisma.admin.findUnique({ where: { username } });
  if (!existingAdmin) {
    const isFirstAdmin = (await prisma.admin.count()) === 0;
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.create({ data: { username, passwordHash, isSuperAdmin: isFirstAdmin } });
    console.log(`Admin criado: usuario="${username}" senha="${password}"${isFirstAdmin ? " (super admin)" : ""}`);
    console.log("Troque essa senha depois de logar, ou rode o seed novamente com outras variaveis SEED_ADMIN_USERNAME/SEED_ADMIN_PASSWORD.");
  } else {
    console.log(`Admin "${username}" ja existe, nada foi alterado.`);
  }

  const activeEvent = await prisma.event.findFirst({ where: { isActive: true } });
  if (!activeEvent) {
    const today = new Date();
    const startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const event = await prisma.event.create({
      data: { label: currentMonthLabel(), startDate, isActive: true },
    });
    console.log(`Evento ativo criado: ${event.label}`);
  } else {
    console.log(`Ja existe um evento ativo: ${activeEvent.label}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
