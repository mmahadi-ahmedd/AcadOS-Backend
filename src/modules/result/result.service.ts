import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";
import { ExamService } from "../exam/exam.service";

// simple grading scale based on percentage
const percentageToGradePoint = (percentage: number): number => {
  if (percentage >= 80) return 4.0;
  if (percentage >= 75) return 3.75;
  if (percentage >= 70) return 3.5;
  if (percentage >= 65) return 3.25;
  if (percentage >= 60) return 3.0;
  if (percentage >= 55) return 2.75;
  if (percentage >= 50) return 2.5;
  if (percentage >= 45) return 2.25;
  if (percentage >= 40) return 2.0;
  return 0.0;
};

const enterResults = async (
  instructorUserId: string,
  payload: { examId: string; records: { studentId: string; marksObtained: number }[] }
) => {
  const exam = await ExamService.getExamById(payload.examId);

  const section = await prisma.section.findUnique({ where: { id: exam.sectionId } });
  if (!section) throw new AppError(404, "Section not found.");
  await ExamService.verifyInstructorOwnsSection(instructorUserId, section.id);

  return prisma.$transaction(
    payload.records.map((r) => {
      const percentage = (r.marksObtained / exam.totalMarks) * 100;
      const gradePoint = percentageToGradePoint(percentage);
      return prisma.result.upsert({
        where: { examId_studentId: { examId: payload.examId, studentId: r.studentId } },
        update: { marksObtained: r.marksObtained, gradePoint },
        create: { examId: payload.examId, studentId: r.studentId, marksObtained: r.marksObtained, gradePoint },
      });
    })
  );
};

const getMyResults = async (studentUserId: string) => {
  const student = await prisma.student.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new AppError(404, "Student profile not found.");

  return prisma.result.findMany({
    where: { studentId: student.id },
    include: { exam: { include: { section: { include: { course: true } } } } },
    orderBy: { createdAt: "desc" },
  });
};

// Marks all enrollments for a section COMPLETED and recalculates the student's CGPA
// based on the average grade point across all their completed courses (weighted by credit hours).
const finalizeSectionGrades = async (instructorUserId: string, sectionId: string) => {
  await ExamService.verifyInstructorOwnsSection(instructorUserId, sectionId);

  const enrollments = await prisma.enrollment.findMany({
    where: { sectionId, status: "ENROLLED" },
  });

  return prisma.$transaction(async (tx) => {
    for (const enrollment of enrollments) {
      await tx.enrollment.update({ where: { id: enrollment.id }, data: { status: "COMPLETED" } });

      const completedEnrollments = await tx.enrollment.findMany({
        where: { studentId: enrollment.studentId, status: "COMPLETED" },
        include: { section: { include: { course: true } } },
      });

      let totalPoints = 0;
      let totalCredits = 0;

      for (const ce of completedEnrollments) {
        const results = await tx.result.findMany({
          where: { studentId: enrollment.studentId, exam: { sectionId: ce.sectionId } },
        });
        if (!results.length) continue;
        const avgGradePoint = results.reduce((s, r) => s + (r.gradePoint ?? 0), 0) / results.length;
        totalPoints += avgGradePoint * ce.section.course.creditHours;
        totalCredits += ce.section.course.creditHours;
      }

      const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
      await tx.student.update({ where: { id: enrollment.studentId }, data: { cgpa } });
    }

    return { message: `Finalized grades for ${enrollments.length} students.` };
  });
};

const getTranscript = async (studentUserId: string) => {
  const student = await prisma.student.findUnique({
    where: { userId: studentUserId },
    include: {
      enrollments: {
        where: { status: "COMPLETED" },
        include: { section: { include: { course: true } } },
      },
    },
  });
  if (!student) throw new AppError(404, "Student profile not found.");

  return { cgpa: student.cgpa, completedCourses: student.enrollments };
};

export const ResultService = { enterResults, getMyResults, finalizeSectionGrades, getTranscript };
