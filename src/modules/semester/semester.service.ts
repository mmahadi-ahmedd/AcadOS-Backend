import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";

const createSemester = async (payload: {
  name: string; year: number; startDate: string; endDate: string; isActive?: boolean;
}) => {
  return prisma.semester.create({
    data: {
      name: payload.name,
      year: payload.year,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      isActive: payload.isActive ?? false,
    },
  });
};

const getAllSemesters = async (query: { page?: string; limit?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { deletedAt: null };

  const [data, total] = await Promise.all([
    prisma.semester.findMany({ where, skip, take: limit, orderBy: { startDate: "desc" } }),
    prisma.semester.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

const getSemesterById = async (id: string) => {
  const semester = await prisma.semester.findFirst({ where: { id, deletedAt: null } });
  if (!semester) throw new AppError(404, "Semester not found.");
  return semester;
};

const updateSemester = async (id: string, payload: any) => {
  await getSemesterById(id);
  const data: any = { ...payload };
  if (payload.startDate) data.startDate = new Date(payload.startDate);
  if (payload.endDate) data.endDate = new Date(payload.endDate);
  return prisma.semester.update({ where: { id }, data });
};

const softDeleteSemester = async (id: string) => {
  await getSemesterById(id);
  return prisma.semester.update({ where: { id }, data: { deletedAt: new Date() } });
};

export const SemesterService = { createSemester, getAllSemesters, getSemesterById, updateSemester, softDeleteSemester };
