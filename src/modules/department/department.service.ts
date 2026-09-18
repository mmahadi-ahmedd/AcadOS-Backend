import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";

const createDepartment = async (payload: { name: string; code: string }) => {
  return prisma.department.create({ data: payload });
};

const getAllDepartments = async (query: { page?: string; limit?: string; search?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: "insensitive" as const } },
        { code: { contains: query.search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.department.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.department.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

const getDepartmentById = async (id: string) => {
  const dept = await prisma.department.findFirst({ where: { id, deletedAt: null } });
  if (!dept) throw new AppError(404, "Department not found.");
  return dept;
};

const updateDepartment = async (id: string, payload: Partial<{ name: string; code: string }>) => {
  await getDepartmentById(id);
  return prisma.department.update({ where: { id }, data: payload });
};

const softDeleteDepartment = async (id: string) => {
  await getDepartmentById(id);
  return prisma.department.update({ where: { id }, data: { deletedAt: new Date() } });
};

export const DepartmentService = {
  createDepartment, getAllDepartments, getDepartmentById, updateDepartment, softDeleteDepartment,
};
