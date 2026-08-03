-- This app never uses Supabase's auto-generated PostgREST API or client SDK —
-- it only connects via Prisma with a direct Postgres connection (the "postgres"
-- role, which owns these tables and is unaffected by RLS). Enabling RLS with no
-- policies blocks anonymous access through Supabase's public REST API while
-- leaving the Prisma connection fully functional.

ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
