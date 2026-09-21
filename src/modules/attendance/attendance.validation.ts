import { z } from "zod";

const markValidation = z.object({
  body: z.object({
    sectionId: z.string().uuid(),
    date: z.string().datetime(),
    records: z.array(z.object({
      studentId: z.string().uuid(),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
    })).min(1, "At least one attendance record is required"),
  }),
});

export const AttendanceValidation = { markValidation };
