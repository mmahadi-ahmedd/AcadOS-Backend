import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";

const createProgram = async (payload: {
  name: string; departmentId: string; degreeLevel: string; totalCredits: number;
}) => {
  const dept = await prisma.department.findFirst({ where: { id: payload.departmentId, deletedAt: null } });
  if (!dept) throw new AppError(404, "Department not found.");
  return prisma.program.create({ data: payload });
};

const getAllPrograms = async (query: { page?: string; limit?: string; departmentId?: string; search?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(query.departmentId && { departmentId: query.departmentId }),
    ...(query.search && { name: { contains: query.search, mode: "insensitive" as const } }),
  };

  const [data, total] = await Promise.all([
    prisma.program.findMany({ where, skip, take: limit, include: { department: true }, orderBy: { createdAt: "desc" } }),
    prisma.program.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

const getProgramById = async (id: string) => {
  const program = await prisma.program.findFirst({ where: { id, deletedAt: null }, include: { department: true } });
  if (!program) throw new AppError(404, "Program not found.");
  return program;
};

const updateProgram = async (id: string, payload: Partial<{ name: string; degreeLevel: string; totalCredits: number }>) => {
  await getProgramById(id);
  return prisma.program.update({ where: { id }, data: payload });
};

const softDeleteProgram = async (id: string) => {
  await getProgramById(id);
  return prisma.program.update({ where: { id }, data: { deletedAt: new Date() } });
};

export const ProgramService = { createProgram, getAllPrograms, getProgramById, updateProgram, softDeleteProgram };
