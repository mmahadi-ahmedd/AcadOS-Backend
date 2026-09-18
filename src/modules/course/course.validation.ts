import { z } from "zod";

const createValidation = z.object({
  body: z.object({
    code: z.string().min(2, "Course code is required"),
    title: z.string().min(2, "Title is required"),
    creditHours: z.number().int().positive("Credit hours must be positive"),
    departmentId: z.string().uuid("Invalid department id"),
    prerequisiteIds: z.array(z.string().uuid()).optional(),
  }),
});

const updateValidation = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    creditHours: z.number().int().positive().optional(),
  }),
});



export const CourseValidation = { createValidation, updateValidation };
