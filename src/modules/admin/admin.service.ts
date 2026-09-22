import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";
import { logAction } from "../../utils/auditLog";

const getAllUsers = async (query: { page?: string; limit?: string; role?: string; search?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(query.role && { role: query.role as any }),
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: "insensitive" as const } },
        { email: { contains: query.search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where, skip, take: limit,
      select: { id: true, name: true, email: true, role: true, phone: true, isVerified: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

const updateUserRole = async (adminUserId: string, targetUserId: string, newRole: string) => {
  const user = await prisma.user.findFirst({ where: { id: targetUserId, deletedAt: null } });
  if (!user) throw new AppError(404, "User not found.");

  const oldRole = user.role;
  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole as any },
    select: { id: true, name: true, email: true, role: true },
  });

  await logAction(adminUserId, "UPDATE_USER_ROLE", "User", targetUserId, { from: oldRole, to: newRole });

  return updated;
};

const softDeleteUser = async (adminUserId: string, targetUserId: string) => {
  const user = await prisma.user.findFirst({ where: { id: targetUserId, deletedAt: null } });
  if (!user) throw new AppError(404, "User not found.");

  const updated = await prisma.user.update({ where: { id: targetUserId }, data: { deletedAt: new Date() } });
  await logAction(adminUserId, "DELETE_USER", "User", targetUserId);
  return updated;
};

const getDashboardStats = async () => {
  const [totalStudents, totalInstructors, totalCourses, totalSections, activeEnrollments, totalRevenueResult] =
    await Promise.all([
      prisma.student.count({ where: { deletedAt: null } }),
      prisma.instructor.count({ where: { deletedAt: null } }),
      prisma.course.count({ where: { deletedAt: null } }),
      prisma.section.count({ where: { deletedAt: null } }),
      prisma.enrollment.count({ where: { status: { in: ["ENROLLED", "COMPLETED"] } } }),
      prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    ]);

  return {
    totalStudents,
    totalInstructors,
    totalCourses,
    totalSections,
    activeEnrollments,
    totalRevenue: totalRevenueResult._sum.amount ?? 0,
  };
};

const getAuditLogs = async (query: { page?: string; limit?: string; entityType?: string; userId?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    ...(query.entityType && { entityType: query.entityType }),
    ...(query.userId && { userId: query.userId }),
  };

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where, skip, take: limit,
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

export const AdminService = { getAllUsers, updateUserRole, softDeleteUser, getDashboardStats, getAuditLogs };
