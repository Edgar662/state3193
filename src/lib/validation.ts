import { z } from "zod";
import { DAYS, SLOT_COUNT } from "@/lib/slots";

const gameIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "invalid_input")
  .min(1)
  .max(20);

const playerNameSchema = z.string().trim().min(1).max(50);

const allianceSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/, "invalid_input")
  .transform((v) => v.toUpperCase());

export const bookingInputSchema = z.object({
  gameId: gameIdSchema,
  playerName: playerNameSchema,
  alliance: allianceSchema,
  day: z.enum(DAYS),
  slot: z.number().int().min(0).max(SLOT_COUNT - 1),
});

export type BookingInput = z.infer<typeof bookingInputSchema>;

export const batchBookingInputSchema = z.object({
  gameId: gameIdSchema,
  playerName: playerNameSchema,
  alliance: allianceSchema,
  days: z.array(z.enum(DAYS)).min(1),
  slot: z.number().int().min(0).max(SLOT_COUNT - 1),
});

export type BatchBookingInput = z.infer<typeof batchBookingInputSchema>;

export const createEventInputSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type CreateEventInput = z.infer<typeof createEventInputSchema>;

export const createAdminInputSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_.-]+$/, "invalid_input"),
  password: z.string().min(8).max(100),
});

export type CreateAdminInput = z.infer<typeof createAdminInputSchema>;
