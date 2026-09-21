import { z } from "zod";

const enrollValidation = z.object({
  body: z.object({
    sectionId: z.string().uuid("Invalid section id"),
  }),
});

export const EnrollmentValidation = { enrollValidation };
