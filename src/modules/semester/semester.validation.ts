import { z } from "zod";

const createValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required"),
    year: z.number().int().min(2000),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    isActive: z.boolean().optional(),
  }),
});

const updateValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const SemesterValidation = { createValidation, updateValidation };
