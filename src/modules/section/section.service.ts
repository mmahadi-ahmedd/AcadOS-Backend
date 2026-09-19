import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";

const createSection = async (payload: {
  courseId: string; semesterId: string; instructorId: string; sectionCode: string; capacity: number;
}) => {
  const [course, semester, instructor] = await Promise.all([
    prisma.course.findFirst({ where: { id: payload.courseId, deletedAt: null } }),
    prisma.semester.findFirst({ where: { id: payload.semesterId, deletedAt: null } }),
    prisma.instructor.findFirst({ where: { id: payload.instructorId, deletedAt: null } }),
  ]);

  if (!course) throw new AppError(404, "Course not found.");
  if (!semester) throw new AppError(404, "Semester not found.");
  if (!instructor) throw new AppError(404, "Instructor not found.");

  return prisma.section.create({ data: payload });
};

const getAllSections = async (query: {
  page?: string; limit?: string; semesterId?: string; courseId?: string; instructorId?: string;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(query.semesterId && { semesterId: query.semesterId }),
    ...(query.courseId && { courseId: query.courseId }),
    ...(query.instructorId && { instructorId: query.instructorId }),
  };

  const [data, total] = await Promise.all([
    prisma.section.findMany({
      where, skip, take: limit,
      include: {
        course: true, semester: true,
        instructor: { include: { user: { select: { name: true, email: true } } } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.section.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

const getSectionById = async (id: string) => {
  const section = await prisma.section.findFirst({
    where: { id, deletedAt: null },
    include: {
      course: true, semester: true,
      instructor: { include: { user: { select: { name: true, email: true } } } },
      _count: { select: { enrollments: true } },
    },
  });
  if (!section) throw new AppError(404, "Section not found.");
  return section;
};

// sections currently taught by the logged-in instructor
const getMySections = async (instructorUserId: string) => {
  const instructor = await prisma.instructor.findUnique({ where: { userId: instructorUserId } });
  if (!instructor) throw new AppError(404, "Instructor profile not found.");

  return prisma.section.findMany({
    where: { instructorId: instructor.id, deletedAt: null },
    include: { course: true, semester: true, _count: { select: { enrollments: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const updateSection = async (id: string, payload: Partial<{ instructorId: string; capacity: number }>) => {
  await getSectionById(id);
  return prisma.section.update({ where: { id }, data: payload });
};

const softDeleteSection = async (id: string) => {
  await getSectionById(id);
  return prisma.section.update({ where: { id }, data: { deletedAt: new Date() } });
};

export const SectionService = {
  createSection, getAllSections, getSectionById, getMySections, updateSection, softDeleteSection,
};
