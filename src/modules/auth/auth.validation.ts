import { z } from "zod";

const registerValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]),
    phone: z.string().optional(),
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

const refreshTokenValidation = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

export const AuthValidation = { registerValidation, loginValidation, refreshTokenValidation };
