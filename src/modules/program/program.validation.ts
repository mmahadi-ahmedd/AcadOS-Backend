import { z } from "zod";

const createValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required"),
    departmentId: z.string().uuid("Invalid department id"),
    degreeLevel: z.string().min(2, "Degree level is required"),
    totalCredits: z.number().int().positive("Total credits must be positive"),
  }),
});

const updateValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    degreeLevel: z.string().min(2).optional(),
    totalCredits: z.number().int().positive().optional(),
  }),
});

export const ProgramValidation = { createValidation, updateValidation };
