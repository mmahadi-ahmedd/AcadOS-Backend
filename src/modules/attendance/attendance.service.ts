import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";

const verifyInstructorOwnsSection = async (instructorUserId: string, sectionId: string) => {
  const instructor = await prisma.instructor.findUnique({ where: { userId: instructorUserId } });
  if (!instructor) throw new AppError(404, "Instructor profile not found.");

  const section = await prisma.section.findFirst({ where: { id: sectionId, deletedAt: null } });
  if (!section) throw new AppError(404, "Section not found.");
  if (section.instructorId !== instructor.id) {
    throw new AppError(403, "You are not the instructor for this section.");
  }
  return section;
};

const markAttendance = async (
  instructorUserId: string,
  payload: { sectionId: string; date: string; records: { studentId: string; status: string }[] }
) => {
  await verifyInstructorOwnsSection(instructorUserId, payload.sectionId);
  const date = new Date(payload.date);

  return prisma.$transaction(
    payload.records.map((r) =>
      prisma.attendance.upsert({
        where: { studentId_sectionId_date: { studentId: r.studentId, sectionId: payload.sectionId, date } },
        update: { status: r.status as any },
        create: { studentId: r.studentId, sectionId: payload.sectionId, date, status: r.status as any },
      })
    )
  );
};

const getSectionAttendance = async (sectionId: string, query: { date?: string }) => {
  return prisma.attendance.findMany({
    where: { sectionId, ...(query.date && { date: new Date(query.date) }) },
    include: { student: { include: { user: { select: { name: true, email: true } } } } },
    orderBy: { date: "desc" },
  });
};

const getMyAttendance = async (studentUserId: string, query: { sectionId?: string }) => {
  const student = await prisma.student.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new AppError(404, "Student profile not found.");

  return prisma.attendance.findMany({
    where: { studentId: student.id, ...(query.sectionId && { sectionId: query.sectionId }) },
    include: { section: { include: { course: true } } },
    orderBy: { date: "desc" },
  });
};

export const AttendanceService = { markAttendance, getSectionAttendance, getMyAttendance };
