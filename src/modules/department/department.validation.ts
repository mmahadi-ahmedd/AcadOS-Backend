import { z } from "zod";

const createValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required"),
    code: z.string().min(2, "Code is required"),
  }),
});

const updateValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    code: z.string().min(2).optional(),
  }),
});

export const DepartmentValidation = { createValidation, updateValidation };
