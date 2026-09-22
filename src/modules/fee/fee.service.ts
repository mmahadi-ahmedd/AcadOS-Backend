import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";

const generateFee = async (payload: { studentId: string; semesterId: string; amount: number }) => {
  const [student, semester] = await Promise.all([
    prisma.student.findFirst({ where: { id: payload.studentId, deletedAt: null } }),
    prisma.semester.findFirst({ where: { id: payload.semesterId, deletedAt: null } }),
  ]);
  if (!student) throw new AppError(404, "Student not found.");
  if (!semester) throw new AppError(404, "Semester not found.");

  const existing = await prisma.fee.findUnique({
    where: { studentId_semesterId: { studentId: payload.studentId, semesterId: payload.semesterId } },
  });
  if (existing) throw new AppError(409, "Fee already generated for this student and semester.");

  return prisma.fee.create({ data: payload });
};

const getMyFees = async (studentUserId: string) => {
  const student = await prisma.student.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new AppError(404, "Student profile not found.");

  return prisma.fee.findMany({
    where: { studentId: student.id },
    include: { semester: true, payments: true },
    orderBy: { createdAt: "desc" },
  });
};

const getAllFees = async (query: { page?: string; limit?: string; status?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { ...(query.status && { status: query.status as any }) };

  const [data, total] = await Promise.all([
    prisma.fee.findMany({
      where, skip, take: limit,
      include: { student: { include: { user: { select: { name: true, email: true } } } }, semester: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.fee.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

const getFeeById = async (id: string) => {
  const fee = await prisma.fee.findUnique({ where: { id }, include: { semester: true, payments: true } });
  if (!fee) throw new AppError(404, "Fee not found.");
  return fee;
};

export const FeeService = { generateFee, getMyFees, getAllFees, getFeeById };
