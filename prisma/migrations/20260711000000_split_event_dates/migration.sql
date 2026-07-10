-- Replace single startDate + fixed offsets with 3 independent per-day dates,
-- since Construction/Research/Troops days are not always consecutive.

-- Add as nullable first so existing rows are not rejected.
ALTER TABLE "Event" ADD COLUMN "constructionDate" DATE;
ALTER TABLE "Event" ADD COLUMN "researchDate" DATE;
ALTER TABLE "Event" ADD COLUMN "troopsDate" DATE;

-- Backfill existing rows using the old consecutive-day assumption.
UPDATE "Event" SET
  "constructionDate" = "startDate",
  "researchDate" = "startDate" + INTERVAL '1 day',
  "troopsDate" = "startDate" + INTERVAL '2 day';

-- Now that every row has a value, enforce NOT NULL.
ALTER TABLE "Event" ALTER COLUMN "constructionDate" SET NOT NULL;
ALTER TABLE "Event" ALTER COLUMN "researchDate" SET NOT NULL;
ALTER TABLE "Event" ALTER COLUMN "troopsDate" SET NOT NULL;

ALTER TABLE "Event" DROP COLUMN "startDate";
