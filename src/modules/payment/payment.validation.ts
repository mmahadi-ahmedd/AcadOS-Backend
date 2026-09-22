import { z } from "zod";

const initiateValidation = z.object({
  body: z.object({
    feeId: z.string().uuid(),
  }),
});

export const PaymentValidation = { initiateValidation };
