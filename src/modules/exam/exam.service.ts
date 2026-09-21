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
};

const createExam = async (
  instructorUserId: string,
  payload: { sectionId: string; title: string; totalMarks: number; examDate: string }
) => {
  await verifyInstructorOwnsSection(instructorUserId, payload.sectionId);
  return prisma.exam.create({
    data: {
      sectionId: payload.sectionId,
      title: payload.title,
      totalMarks: payload.totalMarks,
      examDate: new Date(payload.examDate),
    },
  });
};

const getSectionExams = async (sectionId: string) => {
  return prisma.exam.findMany({
    where: { sectionId, deletedAt: null },
    orderBy: { examDate: "asc" },
  });
};

const getExamById = async (id: string) => {
  const exam = await prisma.exam.findFirst({ where: { id, deletedAt: null } });
  if (!exam) throw new AppError(404, "Exam not found.");
  return exam;
};

export const ExamService = { createExam, getSectionExams, getExamById, verifyInstructorOwnsSection };
