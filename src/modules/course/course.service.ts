import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";

const createCourse = async (payload: {
  code: string; title: string; creditHours: number; departmentId: string; prerequisiteIds?: string[];
}) => {
  const dept = await prisma.department.findFirst({ where: { id: payload.departmentId, deletedAt: null } });
  if (!dept) throw new AppError(404, "Department not found.");

  return prisma.$transaction(async (tx) => {
    const course = await tx.course.create({
      data: {
        code: payload.code,
        title: payload.title,
        creditHours: payload.creditHours,
        departmentId: payload.departmentId,
      },
    });

    if (payload.prerequisiteIds?.length) {
      await tx.coursePrerequisite.createMany({
        data: payload.prerequisiteIds.map((prerequisiteId) => ({
          courseId: course.id,
          prerequisiteId,
        })),
      });
    }

    return course;
  });
};

const getAllCourses = async (query: {
  page?: string; limit?: string; departmentId?: string; search?: string; sortBy?: string;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(query.departmentId && { departmentId: query.departmentId }),
    ...(query.search && {
      OR: [
        { title: { contains: query.search, mode: "insensitive" as const } },
        { code: { contains: query.search, mode: "insensitive" as const } },
      ],
    }),
  };

  const orderBy = query.sortBy ? { [query.sortBy]: "asc" as const } : { createdAt: "desc" as const };

  const [data, total] = await Promise.all([
    prisma.course.findMany({
      where, skip, take: limit, orderBy,
      include: { department: true, prerequisites: { include: { prerequisite: true } } },
    }),
    prisma.course.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

const getCourseById = async (id: string) => {
  const course = await prisma.course.findFirst({
    where: { id, deletedAt: null },
    include: { department: true, prerequisites: { include: { prerequisite: true } } },
  });
  if (!course) throw new AppError(404, "Course not found.");
  return course;
};

const updateCourse = async (id: string, payload: Partial<{ title: string; creditHours: number }>) => {
  await getCourseById(id);
  return prisma.course.update({ where: { id }, data: payload });
};

const softDeleteCourse = async (id: string) => {
  await getCourseById(id);
  return prisma.course.update({ where: { id }, data: { deletedAt: new Date() } });
};

export const CourseService = { createCourse, getAllCourses, getCourseById, updateCourse, softDeleteCourse };
