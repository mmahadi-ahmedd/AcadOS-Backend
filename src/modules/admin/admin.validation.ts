import { z } from "zod";

const updateUserRoleValidation = z.object({
  body: z.object({
    role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]),
  }),
});

export const AdminValidation = { updateUserRoleValidation };
