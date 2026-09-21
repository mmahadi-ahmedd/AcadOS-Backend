import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";

const getMe = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true, name: true, email: true, role: true, phone: true, isVerified: true, createdAt: true,
      student: { include: { department: true, program: true } },
      instructor: { include: { department: true } },
    },
  });
  if (!user) throw new AppError(404, "User not found.");
  return user;
};

const updateMe = async (userId: string, payload: Partial<{ name: string; phone: string }>) => {
  return prisma.user.update({
    where: { id: userId },
    data: payload,
    select: { id: true, name: true, email: true, role: true, phone: true },
  });
};

const createStudentProfile = async (
  userId: string,
  payload: { studentId: string; departmentId: string; programId: string; enrollYear: number }
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found.");
  if (user.role !== "STUDENT") throw new AppError(403, "Only STUDENT accounts can create a student profile.");

  const existing = await prisma.student.findUnique({ where: { userId } });
  if (existing) throw new AppError(409, "Student profile already exists.");

  const [dept, program] = await Promise.all([
    prisma.department.findFirst({ where: { id: payload.departmentId, deletedAt: null } }),
    prisma.program.findFirst({ where: { id: payload.programId, deletedAt: null } }),
  ]);
  if (!dept) throw new AppError(404, "Department not found.");
  if (!program) throw new AppError(404, "Program not found.");

  return prisma.student.create({ data: { userId, ...payload } });
};

const createInstructorProfile = async (
  userId: string,
  payload: { employeeId: string; departmentId: string; designation?: string }
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found.");
  if (user.role !== "INSTRUCTOR") throw new AppError(403, "Only INSTRUCTOR accounts can create an instructor profile.");

  const existing = await prisma.instructor.findUnique({ where: { userId } });
  if (existing) throw new AppError(409, "Instructor profile already exists.");

  const dept = await prisma.department.findFirst({ where: { id: payload.departmentId, deletedAt: null } });
  if (!dept) throw new AppError(404, "Department not found.");

  return prisma.instructor.create({ data: { userId, ...payload } });
};

export const UserService = { getMe, updateMe, createStudentProfile, createInstructorProfile };
