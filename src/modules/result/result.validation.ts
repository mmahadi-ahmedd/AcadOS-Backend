import { z } from "zod";

const enterResultsValidation = z.object({
  body: z.object({
    examId: z.string().uuid(),
    records: z.array(z.object({
      studentId: z.string().uuid(),
      marksObtained: z.number().min(0),
    })).min(1, "At least one result record is required"),
  }),
});

export const ResultValidation = { enterResultsValidation };
