import { z } from "zod";

const generateFeeValidation = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    semesterId: z.string().uuid(),
    amount: z.number().positive(),
  }),
});

export const FeeValidation = { generateFeeValidation };
