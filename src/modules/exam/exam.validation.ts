import { z } from "zod";

const createValidation = z.object({
  body: z.object({
    sectionId: z.string().uuid(),
    title: z.string().min(1, "Title is required"),
    totalMarks: z.number().int().positive(),
    examDate: z.string().datetime(),
  }),
});

export const ExamValidation = { createValidation };
