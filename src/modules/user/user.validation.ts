import { z } from "zod";

const updateMeValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
  }),
});

const createStudentProfileValidation = z.object({
  body: z.object({
    studentId: z.string().min(1, "Student ID is required"),
    departmentId: z.string().uuid("Invalid department id"),
    programId: z.string().uuid("Invalid program id"),
    enrollYear: z.number().int().min(2000),
  }),
});

const createInstructorProfileValidation = z.object({
  body: z.object({
    employeeId: z.string().min(1, "Employee ID is required"),
    departmentId: z.string().uuid("Invalid department id"),
    designation: z.string().optional(),
  }),
});

export const UserValidation = {
  updateMeValidation, createStudentProfileValidation, createInstructorProfileValidation,
};
