import prisma from "../config/prisma";

export const logAction = async (
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, any>
) => {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entityType, entityId, metadata },
    });
  } catch (err) {
    // audit logging must never break the main operation
    console.error("Failed to write audit log:", err);
  }
};
