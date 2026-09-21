import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";

const getStudentProfile = async (userId: string) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new AppError(404, "Student profile not found. Please complete your profile first.");
  return student;
};

const enrollInSection = async (studentUserId: string, sectionId: string) => {
  const student = await getStudentProfile(studentUserId);

  return prisma.$transaction(async (tx) => {
    // lock-safe: re-fetch section + course + prerequisites inside the transaction
    const section = await tx.section.findFirst({
      where: { id: sectionId, deletedAt: null },
      include: { course: { include: { prerequisites: true } } },
    });
    if (!section) throw new AppError(404, "Section not found.");

    // prevent duplicate enrollment
    const existing = await tx.enrollment.findUnique({
      where: { studentId_sectionId: { studentId: student.id, sectionId } },
    });
    if (existing) throw new AppError(409, "You are already enrolled in this section.");

    // prerequisite validation
    if (section.course.prerequisites.length) {
      for (const prereq of section.course.prerequisites) {
        const completed = await tx.enrollment.findFirst({
          where: {
            studentId: student.id,
            status: "COMPLETED",
            section: { courseId: prereq.prerequisiteId },
          },
        });
        if (!completed) {
          throw new AppError(400, `Prerequisite not met for course ${section.course.code}.`);
        }
      }
    }

    // seat-limit check inside the transaction (prevents overbooking under concurrency)
    const enrolledCount = await tx.enrollment.count({
      where: { sectionId, status: { in: ["PENDING", "ENROLLED"] } },
    });
    if (enrolledCount >= section.capacity) {
      throw new AppError(400, "This section is full.");
    }

    return tx.enrollment.create({
      data: { studentId: student.id, sectionId, status: "ENROLLED" },
    });
  });
};

const dropEnrollment = async (studentUserId: string, enrollmentId: string) => {
  const student = await getStudentProfile(studentUserId);

  const enrollment = await prisma.enrollment.findFirst({
    where: { id: enrollmentId, studentId: student.id, deletedAt: null },
  });
  if (!enrollment) throw new AppError(404, "Enrollment not found.");

  return prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: "DROPPED" },
  });
};

const getMyEnrollments = async (studentUserId: string, query: { status?: string }) => {
  const student = await getStudentProfile(studentUserId);

  return prisma.enrollment.findMany({
    where: {
      studentId: student.id,
      deletedAt: null,
      ...(query.status && { status: query.status as any }),
    },
    include: { section: { include: { course: true, semester: true } } },
    orderBy: { enrolledAt: "desc" },
  });
};

const getSectionEnrollments = async (sectionId: string) => {
  return prisma.enrollment.findMany({
    where: { sectionId, deletedAt: null },
    include: { student: { include: { user: { select: { name: true, email: true } } } } },
    orderBy: { enrolledAt: "asc" },
  });
};

export const EnrollmentService = {
  enrollInSection, dropEnrollment, getMyEnrollments, getSectionEnrollments,
};
