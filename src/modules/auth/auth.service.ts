import bcrypt from "bcryptjs";
import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";

const register = async (payload: {
  name: string; email: string; password: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN"; phone?: string;
}) => {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) throw new AppError(409, "A user with this email already exists.");

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      name: payload.name, email: payload.email, password: hashedPassword,
      role: payload.role, phone: payload.phone,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return user;
};

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user || user.deletedAt) throw new AppError(401, "Invalid email or password.");
  if (!user.password) throw new AppError(401, "This account uses social login. Please sign in with Google.");

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) throw new AppError(401, "Invalid email or password.");

  const jwtPayload = { userId: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(jwtPayload);
  const refreshToken = signRefreshToken(jwtPayload);

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  return {
    accessToken, refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

const refreshToken = async (token: string) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError(401, "Invalid or expired refresh token.");
  }
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user || user.refreshToken !== token) {
    throw new AppError(401, "Refresh token does not match. Please log in again.");
  }
  const jwtPayload = { userId: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(jwtPayload);
  return { accessToken };
};

const logout = async (userId: string) => {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
};

export const AuthService = { register, login, refreshToken, logout };
