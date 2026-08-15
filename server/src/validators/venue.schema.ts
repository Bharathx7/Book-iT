import { z } from "zod";

export const createVenueSchema = z.object({
  name: z
    .string()
    .min(2, "Venue name must be at least 2 characters")
    .max(200, "Venue name is too long"),

  description: z
    .string()
    .optional(),

  category: z
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category is too long")
    .optional(),

  address: z
    .string()
    .optional(),

  pricePerHour: z
    .number()
    .min(0, "Price cannot be negative"),
});