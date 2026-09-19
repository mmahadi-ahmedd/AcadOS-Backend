import { z } from "zod";

const createValidation = z.object({
  body: z.object({
    courseId: z.string().uuid("Invalid course id"),
    semesterId: z.string().uuid("Invalid semester id"),
    instructorId: z.string().uuid("Invalid instructor id"),
    sectionCode: z.string().min(1, "Section code is required"),
    capacity: z.number().int().positive("Capacity must be positive"),
  }),
});

const updateValidation = z.object({
  body: z.object({
    instructorId: z.string().uuid().optional(),
    capacity: z.number().int().positive().optional(),
  }),
});

export const SectionValidation = { createValidation, updateValidation };
